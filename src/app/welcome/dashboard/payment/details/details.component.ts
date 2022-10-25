import {
  ChangeDetectionStrategy,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { ICanDeactivate } from 'src/app/shared/i-can-deactivate';
import { PubDataViewModel } from 'src/app/welcome/pub-data.viewmodels';
import { PaymentType } from 'src/data/payment-type';
import { IPaymentDetails } from 'src/data/models/entities/ipayment-details';
import { LocaleService } from 'src/services/transloco/locale.service';
import { AlertDialog } from 'src/helpers/utils/alert-dialog';
import { DateUtil } from 'src/helpers/utils/date-util';
import { Notification } from 'src/helpers/notification/notification';
import { NotificationBuilder } from 'src/helpers/notification/notification-buider';
import { SubSink } from 'subsink';
import { PaymentDetailsViewModel } from '../payment-details.viewmodel';
import { BankTransferFormComponent } from './bank-transfer-form/bank-transfer-form.component';
import { StringResKeys } from './locale/string-res-keys';
import { PaypalFormComponent } from './paypal-form/paypal-form.component';
import { SkrillFormComponent } from './skrill-form/skrill-form.component';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsComponent implements OnInit, OnDestroy, ICanDeactivate {
  private subscriptions = new SubSink();

  updatePaymentDetails = false;

  paymentDetailsForm!: UntypedFormGroup;
  paymentTypeFC = new UntypedFormControl(undefined);

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

  paymentDetailsLastUpdated = '';

  pubFirstName = '';

  paymentDetails: IPaymentDetails | null = null;

  canExitRoute = new Subject<boolean>();

  constructor(
    private localeService: LocaleService,
    private paymentDetailsVM: PaymentDetailsViewModel,
    private pubDataVM: PubDataViewModel,
    private ngZone:NgZone
  ) {}

  goToPayment() {
    this.paymentDetailsForm.markAsPristine();
    this.updatePaymentDetails = !this.updatePaymentDetails;
  }

  public get getSkrillForm(): UntypedFormGroup | null {
    const value = this.paymentDetailsForm.get(this.skrillFormName);
    return value ? (value as UntypedFormGroup) : null;
  }

  public get getPayPalForm(): UntypedFormGroup | null {
    const value = this.paymentDetailsForm.get(this.payPalFormName);
    return value ? (value as UntypedFormGroup) : null;
  }

  public get getBankTransferForm(): UntypedFormGroup | null {
    const value = this.paymentDetailsForm.get(this.bankTransferFormName);
    return value ? (value as UntypedFormGroup) : null;
  }

  canExit(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.paymentDetailsForm.dirty) {
      AlertDialog.warn(
        this.unsavedFieldsMsg,
        this.unsavedFieldsMsgTitle,
        this.yes,
        this.no,
        () => this.ngZone.run(()=>this.canExitRoute.next(true)),
        () => this.ngZone.run(()=>this.canExitRoute.next(false))
      );
      return this.canExitRoute;
    } else {
      return true;
    }
  }

  ngOnInit(): void {
    this.translateStringRes();
    this.paymentDetailsForm = this.generatePaymentDetailsForm();
    this.onPaymentTypeSelectedChangesListener();

    this.listenForPaymentDetailChanges();
    this.listenForPubDataChanges();
  }

  private listenForPubDataChanges() {
    this.subscriptions.sink = this.pubDataVM
      .getPublisher$()
      .subscribe((pubData) => {
        this.pubFirstName = pubData.firstName;
      });
  }

  private listenForPaymentDetailChanges() {
    this.subscriptions.sink = this.paymentDetailsVM
      .getPaymentDetails$()
      .subscribe((paymentDetails) => {
        this.paymentDetails = paymentDetails;
        if (this.paymentDetails) {
          this.setPaymentDetailsLastUpdated(this.paymentDetails);
          this.paymentTypeFC.patchValue(this.paymentDetails.paymentType)
        }
      });
  }

  setPaymentDetailsLastUpdated(paymentDetails: IPaymentDetails) {
    const lastUpdatedTimestamp = paymentDetails.lastUpdated! as Timestamp;
    const lastUpdated = DateUtil.getLocalDateTime(lastUpdatedTimestamp);
    this.paymentDetailsLastUpdated = this.localeService.paramTranslate(
      StringResKeys.lastUpdated,
      { value: DateUtil.getHumanReadbleDateTime(lastUpdated) }
    );
  }

  getPaymentTypeLogo(paymentType: string) {
    if (paymentType === PaymentType.bankTransfer) {
      return 'assets/images/bank-transfer.svg';
    } else if (paymentType === PaymentType.payPal) {
      return 'assets/images/paypal.svg';
    } else {
      return 'assets/images/skrill.svg';
    }
  }

  onPaymentTypeSelectedChangesListener() {
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
    return new UntypedFormGroup({
      paymentTypeFC: this.paymentTypeFC,
    });
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

    this.updatedFailedMsg = this.localeService.translate(
      StringResKeys.updatedFailed
    );
    this.updatedSucessMsg = this.localeService.translate(
      StringResKeys.updatedSuccfly
    );
  }

  onDataUpdate(isSuccessful: boolean) {
    const notification = new NotificationBuilder()
      .setTimeOut(Notification.SHORT_LENGHT).build();
    if (isSuccessful) {
      notification.success(this.updatedSucessMsg);
       this.goToPayment()
    } else {
      notification.error(this.updatedFailedMsg);
    }
  }

  editPaymentDetails() {
    this.updatePaymentDetails = true;
  }

  addPaymentDetails() {
    this.updatePaymentDetails = true;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
