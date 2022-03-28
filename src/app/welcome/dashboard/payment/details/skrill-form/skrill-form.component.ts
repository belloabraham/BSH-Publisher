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
import { PaymentType } from 'src/domain/data/payment-type';
import { Regex } from 'src/domain/data/regex';
import { IPaymentDetails } from 'src/domain/models/entities/ipayment-details';
import { LocaleService } from 'src/helpers/transloco/locale.service';
import { CryptoUtil } from 'src/helpers/utils/crypto';
import { Logger } from 'src/helpers/utils/logger';
import { NotificationBuilder } from 'src/helpers/utils/notification/notification-buider';
import { Shield } from 'src/helpers/utils/shield';
import { IUserAuth } from 'src/services/authentication/iuser-auth';
import { USER_AUTH_IJTOKEN } from 'src/services/authentication/user-auth.token';
import { SubSink } from 'subsink';
import { PaymentInfoViewModel } from '../../payment-info.viewmodel';
import { StringResKeys } from '../locale/string-res-keys';

@Component({
  selector: 'app-skrill-form',
  templateUrl: './skrill-form.component.html',
  styleUrls: ['./skrill-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkrillFormComponent implements OnInit, OnDestroy {
  private subscriptions = new SubSink();

private  pubId = this.userAuth.getPubId()!;

  @Input()
  skrillForm!: FormGroup;

  emailFC!: FormControl;

  hasError = false;

  private updatedSucessMsg = '';
  private updatedFailedMsg = '';

  constructor(
    private paymentDetailsVM: PaymentInfoViewModel,
    @Inject(USER_AUTH_IJTOKEN) private userAuth: IUserAuth,
    private localeService: LocaleService
  ) {
    this.translateStringRes();
  }

  ngOnInit(): void {
    this.listenForPaymentDetailsChange();
  }

  private listenForPaymentDetailsChange() {
    this.subscriptions.sink = this.paymentDetailsVM
      .getPaymentDetails$()
      .subscribe((paymentDetail) => {
        this.updateFormData(paymentDetail)
      });
  }

  private updateFormData(paymentDetail: IPaymentDetails) {
    if (paymentDetail.paymentType === PaymentType.skrill) {
      this.emailFC.patchValue(CryptoUtil.getDecrypted(paymentDetail.skrillEmail!, this.pubId));
    }
  }

  async submitFormData() {
    this.emailFC = this.skrillForm.get('emailFC') as FormControl;
    if (this.emailFC.valid) {
      this.hasError = false;
      await this.updatedPaymentDetails(this.emailFC.value);
    } else {
      this.hasError = true;
    }
  }

  private translateStringRes() {
    this.updatedFailedMsg = this.localeService.translate(
      StringResKeys.updatedFailed
    );
    this.updatedSucessMsg = this.localeService.translate(
      StringResKeys.updatedSuccfly
    );
  }

  private async updatedPaymentDetails(email: string) {
    Shield.standard('.skrill-form');
    let paymentDetails: IPaymentDetails = {
      paymentType: PaymentType.skrill,
      paypalEmail: CryptoUtil.getEncrypted(email, this.pubId),
      lastUpdated: serverTimestamp(),
    };
    const notification = new NotificationBuilder().build();
    try {
      await this.paymentDetailsVM.updatePaymentDetails(paymentDetails, this.pubId);
      Shield.remove('.skrill-form');
      this.paymentDetailsVM.setPaymentDetails(paymentDetails);
      notification.success(this.updatedSucessMsg);
    } catch (error) {
      Shield.remove('.skrill-form');
      notification.error(this.updatedFailedMsg);
      Logger.error(this.emailFC, this.updatedPaymentDetails.name, error);
    }
  }

  static getSkrillForm() {
    return new FormGroup({
      emailFC: new FormControl(undefined, [
        Validators.required,
        Validators.pattern(Regex.email),
      ]),
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
