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
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { countries } from 'src/data/countries';
import { PaymentType } from 'src/data/payment-type';
import { IPaymentDetails } from 'src/data/models/entities/ipayment-details';
import { ICountry } from 'src/data/models/icountry';
import { CryptoUtil } from 'src/helpers/utils/crypto';
import { Logger } from 'src/helpers/utils/logger';
import { Shield } from 'src/helpers/utils/shield';
import { IUserAuth } from 'src/services/authentication/iuser-auth';
import { USER_AUTH_IJTOKEN } from 'src/services/authentication/user-auth.token';
import { SubSink } from 'subsink';
import { PaymentDetailsViewModel } from '../../payment-details.viewmodel';
import { BankTranferForeignFormComponent } from './bank-tranfer-foreign-form/bank-tranfer-foreign-form.component';
import { escapeJSONNewlineChars } from 'src/helpers/utils/string-util';

@Component({
  selector: 'app-bank-transfer-form',
  templateUrl: './bank-transfer-form.component.html',
  styleUrls: ['./bank-transfer-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankTransferFormComponent implements OnDestroy, OnInit {
  @Input()
  bankTransferForm!: UntypedFormGroup;

  private subscriptions = new SubSink();

  @Output()
  dataUpdatedEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  private pubId = this.userAuth.getPubId()!;

  countries: ICountry[] = countries;
  private nigeria = this.countries[0].name;

  private bankTransferForeignFormName = 'bankTrasnferForeignFormName';

  public get bankForeignForm(): UntypedFormGroup | null {
    const value = this.bankTransferForm.get(this.bankTransferForeignFormName);
    return value ? (value as UntypedFormGroup) : null;
  }

  public get bankNameFC(): UntypedFormControl {
    return this.bankTransferForm.get('bankNameFC') as UntypedFormControl;
  }
  public get accountNumberFC(): UntypedFormControl {
    return this.bankTransferForm.get('accountNumberFC') as UntypedFormControl;
  }

  public get accountNameFC(): UntypedFormControl {
    return this.bankTransferForm.get('accountNameFC') as UntypedFormControl;
  }

  public get countryFC(): UntypedFormControl {
    return this.bankTransferForm.get('countryFC') as UntypedFormControl;
  }

  public get bankAddressFC(): UntypedFormControl {
    return this.bankForeignForm?.get('bankAddressFC') as UntypedFormControl;
  }
  public get bankSwiftCodeFC(): UntypedFormControl {
    return this.bankForeignForm?.get('bankSwiftCodeFC') as UntypedFormControl;
  }

  public get residentialAddressFC(): UntypedFormControl {
    return this.bankForeignForm?.get('residentialAddressFC') as UntypedFormControl;
  }
  public get accountTypeFC(): UntypedFormControl {
    return this.bankForeignForm?.get('accountTypeFC') as UntypedFormControl;
  }
  public get bankRoutingNumberFC(): UntypedFormControl {
    return this.bankForeignForm?.get('bankRoutingNumberFC') as UntypedFormControl;
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
      this.residentialAddressFC.patchValue(
        this.decrypt(paymentDetail.address!)
      );
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
    return new UntypedFormGroup({
      countryFC: new UntypedFormControl(undefined, [Validators.required]),
      bankNameFC: new UntypedFormControl(undefined, [Validators.required]),
      accountNameFC: new UntypedFormControl(undefined, [Validators.required]),
      accountNumberFC: new UntypedFormControl(undefined, [Validators.required]),
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  async submitFormData() {
    Shield.standard('.bank-transfer-form');
    const paymentDetails: IPaymentDetails = {
      paymentType: PaymentType.bankTransfer,
      accountName: this.getEncrypted(
        escapeJSONNewlineChars(this.accountNameFC.value)
      ),
      accountNumber: this.getEncrypted(this.accountNumberFC.value),
      bankName: this.getEncrypted(escapeJSONNewlineChars(this.bankNameFC.value)),
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
      paymentDetails.bankAddress = this.getEncrypted(escapeJSONNewlineChars(this.bankAddressFC.value));
      paymentDetails.country = this.getEncrypted(this.countryFC.value);
      paymentDetails.bankRoutingNumber = this.getEncrypted(
        escapeJSONNewlineChars(this.bankRoutingNumberFC.value)
      );
      paymentDetails.bankSwiftCode = this.getEncrypted(
        escapeJSONNewlineChars(this.bankSwiftCodeFC.value)
      );
      paymentDetails.address = this.getEncrypted(
        escapeJSONNewlineChars(this.residentialAddressFC.value)
      );
    }
  }
}
