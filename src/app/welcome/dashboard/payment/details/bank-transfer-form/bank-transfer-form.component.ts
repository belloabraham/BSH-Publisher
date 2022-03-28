import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { serverTimestamp } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { countries } from 'src/domain/data/countries';
import { PaymentType } from 'src/domain/data/payment-type';
import { IPaymentDetails } from 'src/domain/models/entities/ipayment-details';
import { ICountry } from 'src/domain/models/icountry';
import { LocaleService } from 'src/helpers/transloco/locale.service';
import { CryptoUtil } from 'src/helpers/utils/crypto';
import { NotificationBuilder } from 'src/helpers/utils/notification/notification-buider';
import { IUserAuth } from 'src/services/authentication/iuser-auth';
import { USER_AUTH_IJTOKEN } from 'src/services/authentication/user-auth.token';
import { SubSink } from 'subsink';
import { PaymentInfoViewModel } from '../../payment-info.viewmodel';
import { StringResKeys } from '../locale/string-res-keys';
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

  private updatedSucessMsg = '';
  private updatedFailedMsg = '';

  private pubId = this.userAuth.getPubId()!;

  countries: ICountry[] = countries;
  private nigeria = this.countries[0].name;

  private bankTransferForeignFormName = 'bankTrasnferForeignFormName';

  public get bankForeignForm(): FormGroup | null {
    let value = this.bankTransferForm.get(this.bankTransferForeignFormName);
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
    private paymentDetailsVM: PaymentInfoViewModel,
    @Inject(USER_AUTH_IJTOKEN) private userAuth: IUserAuth,
    private localeService: LocaleService
  ) {
    this.translateStringRes();
  }

  ngOnInit(): void {
    this.onCountrySelectedChanges();
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
    let paymentDetails: IPaymentDetails = {
      paymentType: PaymentType.bankTransfer,
      accountName: this.getEncrypted(this.accountNameFC.value),
      accountNumber: this.getEncrypted(this.accountNumberFC.value),
      bankName: this.getEncrypted(this.bankNameFC.value),
      lastUpdated: serverTimestamp(),
    };
    this.addForiegnBankFormData(paymentDetails);
    const notification = new NotificationBuilder().build();
    try {
      await this.paymentDetailsVM.updatePaymentDetails(
        paymentDetails,
        this.pubId
      );
      this.paymentDetailsVM.setPaymentDetails(paymentDetails);
      notification.success(this.updatedSucessMsg);
    } catch (error) {
      notification.error(this.updatedFailedMsg);
    }
  }

  private translateStringRes() {
    this.updatedFailedMsg = this.localeService.translate(
      StringResKeys.updatedSuccfly
    );
    this.updatedSucessMsg = this.localeService.translate(
      StringResKeys.updatedFailed
    );
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
