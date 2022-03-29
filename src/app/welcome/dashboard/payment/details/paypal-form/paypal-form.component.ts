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
import { PaymentType } from 'src/domain/data/payment-type';
import { Regex } from 'src/domain/data/regex';
import { IPaymentDetails } from 'src/domain/models/entities/ipayment-details';
import { CryptoUtil } from 'src/helpers/utils/crypto';
import { Logger } from 'src/helpers/utils/logger';
import { Shield } from 'src/helpers/utils/shield';
import { IUserAuth } from 'src/services/authentication/iuser-auth';
import { USER_AUTH_IJTOKEN } from 'src/services/authentication/user-auth.token';
import { SubSink } from 'subsink';
import { PaymentInfoViewModel } from '../../payment-info.viewmodel';

@Component({
  selector: 'app-paypal-form',
  templateUrl: './paypal-form.component.html',
  styleUrls: ['./paypal-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaypalFormComponent implements OnInit, OnDestroy {
  private subscriptions = new SubSink();
  private pubId = this.userAuth.getPubId()!;

  @Input()
  payPalForm!: FormGroup;

  emailFC!: FormControl;
  hasError = false;

  @Output()
  dataUpdatedEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private paymentDetailsVM: PaymentInfoViewModel,
    @Inject(USER_AUTH_IJTOKEN) private userAuth: IUserAuth
  ) {}

  ngOnInit(): void {
    this.emailFC = this.payPalForm.get('emailFC') as FormControl;
    this.listenForPaymentDetailsChange();
  }

  private listenForPaymentDetailsChange() {
    this.subscriptions.sink = this.paymentDetailsVM
      .getPaymentDetails$()
      .subscribe((paymentDetail) => {
        this.updateFormData(paymentDetail);
      });
  }

  private updateFormData(paymentDetail: IPaymentDetails) {
    if (paymentDetail.paymentType === PaymentType.payPal) {
      this.emailFC.patchValue(
        CryptoUtil.getDecrypted(paymentDetail.paypalEmail!, this.pubId)
      );
    }
  }

  async submitFormData() {
    if (this.emailFC.valid) {
      this.hasError = false;
      await this.updatedPaymentDetails(this.emailFC.value);
    } else {
      this.hasError = true;
    }
  }

  private async updatedPaymentDetails(email: string) {
    Shield.standard('.paypal-form');
    let paymentDetails: IPaymentDetails = {
      paymentType: PaymentType.payPal,
      paypalEmail: CryptoUtil.getEncrypted(email, this.pubId),
      lastUpdated: serverTimestamp(),
    };
    try {
      await this.paymentDetailsVM.updatePaymentDetails(
        paymentDetails,
        this.pubId
      );
      this.paymentDetailsVM.setPaymentDetails(paymentDetails);
      Shield.remove('.paypal-form');
      this.dataUpdatedEvent.emit(true);
    } catch (error) {
      Shield.remove('.paypal-form');
      this.dataUpdatedEvent.emit(false);
      Logger.error(this, this.updatedPaymentDetails.name, error);
    }
  }

  static getPayPalForm() {
    return new FormGroup({
      emailFC: new FormControl(undefined, [
        Validators.required,
        Validators.pattern(Regex.EMAIL),
      ]),
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
