import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { AccountType } from 'src/data/account-type';
import { PaymentType } from 'src/data/payment-type';
import { ICanDeactivate } from 'src/guards/i-can-deactivate';
import { LocaleService } from 'src/helpers/transloco/locale.service';
import { SubSink } from 'subsink';
import { BankTransferFormComponent } from './bank-transfer-form/bank-transfer-form.component';
import { StringResKeys } from './locale/string-res-keys';
import { PaypalFormComponent } from './paypal-form/paypal-form.component';
import { SkrillFormComponent } from './skrill-form/skrill-form.component';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit, OnDestroy, ICanDeactivate {
  addPaymentDetailsClick = false;
  private subscriptions = new SubSink();

  paymentDetailsForm!: FormGroup;
  paymentTypeFC = new FormControl(undefined);

  skrillFormName = 'skrillForm';
  payPalFormName = 'payPalForm';
  bankTransferFormName = 'bankTransferForm';

  skrillPaymT = PaymentType.skrill;
  payPalPaymT = PaymentType.payPal;
  bankTransferPaymT = PaymentType.bankTransfer;

  private unsavedFieldsMsgTitle = '';
  private unsavedFieldsMsg = '';
  private yes = '';
  private no = '';
  private updatedSucessMsg = '';
  private updatedFailedMsg = '';

  canExitRoute = new Subject<boolean>();

  public get getSkrillForm(): FormGroup | null {
    let value = this.paymentDetailsForm.get(this.skrillFormName);
    return value ? (value as FormGroup) : null;
  }

  public get getPayPalForm(): FormGroup | null {
    let value = this.paymentDetailsForm.get(this.payPalFormName);
    return value ? (value as FormGroup) : null;
  }

  public get getBankTransferForm(): FormGroup | null {
    let value = this.paymentDetailsForm.get(this.bankTransferFormName);
    return value ? (value as FormGroup) : null;
  }

  constructor(private localeService: LocaleService) {}

  canExit(): boolean | Observable<boolean> | Promise<boolean> {
    return true;
  }

  ngOnInit(): void {
    this.translateStringRes();

    this.paymentDetailsForm = this.generatePaymentDetailsForm();

    this.onPaymentTypeSelected();
  }

  onPaymentTypeSelected() {
    this.subscriptions.sink = this.paymentTypeFC.valueChanges
      .pipe()
      .subscribe((paymentType) => {
        if (paymentType === PaymentType.bankTransfer) {
          this.addBankTransferForm();
        } else if (paymentType === PaymentType.payPal) {
          this.addPayPalForm();
        } else if (paymentType === PaymentType.skrill) {
          this.addSkrillForm();
        }
      });
  }

  addPayPalForm() {
    this.paymentDetailsForm.removeControl(this.bankTransferFormName);
    this.paymentDetailsForm.removeControl(this.skrillFormName);
    this.paymentDetailsForm.addControl(
      this.payPalFormName,
      PaypalFormComponent.getPayPalForm()
    );
  }

  addSkrillForm() {
    this.paymentDetailsForm.removeControl(this.payPalFormName);
    this.paymentDetailsForm.removeControl(this.bankTransferFormName);
    this.paymentDetailsForm.addControl(
      this.skrillFormName,
      SkrillFormComponent.getSkrillForm()
    );
  }

  addBankTransferForm() {
    this.paymentDetailsForm.removeControl(this.payPalFormName);
    this.paymentDetailsForm.removeControl(this.skrillFormName);
    this.paymentDetailsForm.addControl(
      this.bankTransferFormName,
      BankTransferFormComponent.getBankTransferForm()
    );
  }

  generatePaymentDetailsForm() {
    return (this.paymentDetailsForm = new FormGroup({
      paymentTypeFC: this.paymentTypeFC,
    }));
  }

  private translateStringRes() {
    this.no = this.localeService.translate(StringResKeys.no);
    this.yes = this.localeService.translate(StringResKeys.yes);
    this.unsavedFieldsMsg = this.localeService.translate(
      StringResKeys.unsavedFieldsMsg
    );
    this.unsavedFieldsMsgTitle = this.localeService.translate(
      StringResKeys.unsavedFieldsMsgTitle
    );

    /*this.updatedFailedMsg = this.localeService.translate(
      StringResKeys.profileUpdatedFailedMsg
    );
    this.updatedSucessMsg = this.localeService.translate(
      StringResKeys.profileUpdatedSuccessMsg
    );*/
  }

  addPaymentDetails() {
    this.addPaymentDetailsClick = true;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
