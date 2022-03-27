import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PaymentType } from 'src/domain/data/payment-type';
import { Regex } from 'src/domain/data/regex';
import { IPaymentDetails } from 'src/domain/models/entities/ipayment-details';
import { LocaleService } from 'src/helpers/transloco/locale.service';
import { CryptoUtil } from 'src/helpers/utils/crypto';
import { NotificationBuilder } from 'src/helpers/utils/notification/notification-buider';
import { IUserAuth } from 'src/services/authentication/iuser-auth';
import { USER_AUTH_IJTOKEN } from 'src/services/authentication/user-auth.token';
import { PaymentInfoViewModel } from '../../payment-info.viewmodel';
import { StringResKeys } from '../locale/string-res-keys';

@Component({
  selector: 'app-paypal-form',
  templateUrl: './paypal-form.component.html',
  styleUrls: ['./paypal-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaypalFormComponent {
  @Input()
  payPalForm!: FormGroup;

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

  async submitFormData() {
    this.emailFC = this.payPalForm.get('emailFC') as FormControl;
    if (this.emailFC.valid) {
      this.hasError = false;
      await this.updatedPaymentDetails(this.emailFC.value);
    } else {
      this.hasError = true;
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

  private async updatedPaymentDetails(email: string) {
    const pubId = this.userAuth.getPubId()!;
    let paymentDetails: IPaymentDetails = {
      paymentType: PaymentType.payPal,
      paypalEmail: CryptoUtil.getEncrypted(email, pubId),
    };
    const notification = new NotificationBuilder().build();
    try {
      await this.paymentDetailsVM.updatePaymentDetails(paymentDetails, pubId);
      this.paymentDetailsVM.setPaymentDetails(paymentDetails);
      notification.success(this.updatedSucessMsg);
    } catch (error) {
      notification.error(this.updatedFailedMsg);
    }
  }

  static getPayPalForm() {
    return new FormGroup({
      emailFC: new FormControl(undefined, [
        Validators.required,
        Validators.pattern(Regex.email),
      ]),
    });
  }
}
