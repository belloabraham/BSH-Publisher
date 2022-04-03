import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { serverTimestamp } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { countries } from 'src/domain/data/countries';
import { PaymentType } from 'src/domain/data/payment-type';
import { IPaymentDetails } from 'src/domain/models/entities/ipayment-details';
import { ICountry } from 'src/domain/models/icountry';
import { CryptoUtil } from 'src/helpers/utils/crypto';
import { Logger } from 'src/helpers/utils/logger';
import { Shield } from 'src/helpers/utils/shield';
import { IUserAuth } from 'src/services/authentication/iuser-auth';
import { USER_AUTH_IJTOKEN } from 'src/services/authentication/user-auth.token';
import { SubSink } from 'subsink';
import { PaymentDetailsViewModel } from '../../payment-details.viewmodel';
import { BankTranferForeignFormComponent } from './bank-tranfer-foreign-form/bank-tranfer-foreign-form.component';

@Component({
  selector: 'app-bank-transfer-form',
  templateUrl: './bank-transfer-form.component.html',
  styleUrls: ['./bank-transfer-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankTransferFormComponent implements OnDestroy, OnInit {
  @Input()
  bankTransferForm!: FormGroup;

  private subscriptions = new SubSink();

  @Output()
  dataUpdatedEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  private pubId = this.userAuth.getPubId()!;

  countries: ICountry[] = countries;
  private nigeria = this.countries[0].name;

  private bankTransferForeignFormName = 'bankTrasnferForeignFormName';

  public get bankForeignForm(): FormGroup | null {
    const value = this.bankTransferForm.get(this.bankTransferForeignFormName);
    return value ? (value as FormGroup) : null;
  }

  public get bankNameFC(): FormControl {
    return this.bankTransferForm.get('bankNameFC') as FormControl;
  }
  public get accountNumberFC(): FormControl {
    return this.bankTransferForm.get('accountNumberFC') as FormControl;
  }

  public get accountNameFC(): FormControl {
    return this.bankTransferForm.get('accountNameFC') as FormControl;
  }

  public get countryFC(): FormControl {
    return this.bankTransferForm.get('countryFC') as FormControl;
  }

  public get bankAddressFC(): FormControl {
    return this.bankForeignForm?.get('bankAddressFC') as FormControl;
  }
  public get bankSwiftCodeFC(): FormControl {
    return this.bankForeignForm?.get('bankSwiftCodeFC') as FormControl;
  }

  public get addressFC(): FormControl {
    return this.bankForeignForm?.get('addressFC') as FormControl;
  }
  public get accountTypeFC(): FormControl {
    return this.bankForeignForm?.get('accountTypeFC') as FormControl;
  }
  public get bankRoutingNumberFC(): FormControl {
    return this.bankForeignForm?.get('bankRoutingNumberFC') as FormControl;
  }

  constructor(
    private paymentDetailsVM: PaymentDetailsViewModel,
    @Inject(USER_AUTH_IJTOKEN) private userAuth: IUserAuth
  ) {}

  ngOnInit(): void {
    this.onCountrySelectedChanges();
    this.listenForPaymentDetailsChange();
  }

  private listenForPaymentDetailsChange() {
    this.subscriptions.sink = this.paymentDetailsVM
      .getPaymentDetails$()
      .subscribe((paymentDetail) => {
        this.updateFormData(paymentDetail);
      });
  }

  private decrypt(value: string) {
    return CryptoUtil.getDecrypted(value, this.pubId);
  }

  private updateFormData(paymentDetail: IPaymentDetails) {
    if (paymentDetail.paymentType === PaymentType.bankTransfer) {
      this.bankNameFC.patchValue(this.decrypt(paymentDetail.bankName!));
      this.accountNameFC.patchValue(this.decrypt(paymentDetail.accountName!));
      this.accountNumberFC.patchValue(
        this.decrypt(paymentDetail.accountNumber!)
      );
      this.countryFC.patchValue(this.decrypt(paymentDetail.country!));
      this.updateForeignFormData(paymentDetail);
    }
  }

  private updateForeignFormData(paymentDetail: IPaymentDetails) {
    if (paymentDetail.accountType) {
      this.bankAddressFC.patchValue(this.decrypt(paymentDetail.bankAddress!));
      this.bankRoutingNumberFC.patchValue(
        this.decrypt(paymentDetail.bankRoutingNumber!)
      );
      this.bankSwiftCodeFC.patchValue(
        this.decrypt(paymentDetail.bankSwiftCode!)
      );
      this.accountTypeFC.patchValue(this.decrypt(paymentDetail.accountType!));
      this.addressFC.patchValue(this.decrypt(paymentDetail.address!));
    }
  }

  onCountrySelectedChanges() {
    this.subscriptions.sink = this.countryFC.valueChanges.subscribe((value) => {
      if (value !== this.nigeria) {
        this.bankTransferForm.addControl(
          this.bankTransferForeignFormName,
          BankTranferForeignFormComponent.getBankTransferForeignForm()
        );
      } else {
        this.bankTransferForm.removeControl(this.bankTransferForeignFormName);
      }
    });
  }

  static getBankTransferForm() {
    return new FormGroup({
      countryFC: new FormControl(undefined, [Validators.required]),
      bankNameFC: new FormControl(undefined, [Validators.required]),
      accountNameFC: new FormControl(undefined, [Validators.required]),
      accountNumberFC: new FormControl(undefined, [Validators.required]),
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  async submitFormData() {
    Shield.standard('.bank-transfer-form');
    const paymentDetails: IPaymentDetails = {
      paymentType: PaymentType.bankTransfer,
      accountName: this.getEncrypted(this.accountNameFC.value),
      accountNumber: this.getEncrypted(this.accountNumberFC.value),
      bankName: this.getEncrypted(this.bankNameFC.value),
      country: this.getEncrypted(this.countryFC.value),
      lastUpdated: serverTimestamp(),
    };
    this.addForiegnBankFormData(paymentDetails);
    try {
      await this.paymentDetailsVM.updatePaymentDetails(
        { paymentDetails: paymentDetails },
        this.pubId
      );
      Shield.remove('.bank-transfer-form');
      this.dataUpdatedEvent.emit(true);
    } catch (error) {
      Shield.remove('.bank-transfer-form');
      this.dataUpdatedEvent.emit(false);
      Logger.error(this, this.submitFormData.name, error);
    }
  }

  private getEncrypted(value: string) {
    return CryptoUtil.getEncrypted(value, this.pubId);
  }

  private addForiegnBankFormData(paymentDetails: IPaymentDetails) {
    if (this.bankForeignForm) {
      paymentDetails.accountType = this.getEncrypted(this.accountTypeFC.value);
      paymentDetails.bankAddress = this.getEncrypted(this.bankAddressFC.value);
      paymentDetails.country = this.getEncrypted(this.countryFC.value);
      paymentDetails.bankRoutingNumber = this.getEncrypted(
        this.bankRoutingNumberFC.value
      );
      paymentDetails.bankSwiftCode = this.getEncrypted(
        this.bankSwiftCodeFC.value
      );
      paymentDetails.address = this.getEncrypted(this.addressFC.value);
    }
  }
}
