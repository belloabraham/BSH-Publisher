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
import { PaymentType } from 'src/data/payment-type';
import { Regex } from 'src/data/regex';
import { IPaymentDetails } from 'src/data/models/entities/ipayment-details';
import { CryptoUtil } from 'src/helpers/utils/crypto';
import { Logger } from 'src/helpers/utils/logger';
import { Shield } from 'src/helpers/utils/shield';
import { IUserAuth } from 'src/services/authentication/iuser-auth';
import { USER_AUTH_IJTOKEN } from 'src/services/authentication/user-auth.token';
import { SubSink } from 'subsink';
import { PaymentDetailsViewModel } from '../../payment-details.viewmodel';
import { escapeJSONNewlineChars } from 'src/helpers/utils/string-util';

@Component({
  selector: 'app-skrill-form',
  templateUrl: './skrill-form.component.html',
  styleUrls: ['./skrill-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkrillFormComponent implements OnInit, OnDestroy {
  private subscriptions = new SubSink();

  private pubId = this.userAuth.getPubId()!;

  @Input()
  skrillForm!: UntypedFormGroup;

  @Output()
  dataUpdatedEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  emailFC!: UntypedFormControl;

  hasError = false;

  constructor(
    private paymentDetailsVM: PaymentDetailsViewModel,
    @Inject(USER_AUTH_IJTOKEN) private userAuth: IUserAuth
  ) {}

  ngOnInit(): void {
    this.emailFC = this.skrillForm.get('emailFC') as UntypedFormControl;
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
    if (paymentDetail.paymentType === PaymentType.skrill) {
      this.emailFC.patchValue(
        CryptoUtil.getDecrypted(paymentDetail.skrillEmail!, this.pubId)
      );
    }
  }

  async submitFormData() {
    if (this.emailFC.valid) {
      this.hasError = false;
      await this.updatedPaymentDetails(escapeJSONNewlineChars(this.emailFC.value));
    } else {
      this.hasError = true;
    }
  }

  private async updatedPaymentDetails(email: string) {
    Shield.standard('.skrill-form');
    const paymentDetails: IPaymentDetails = {
      paymentType: PaymentType.skrill,
      skrillEmail: CryptoUtil.getEncrypted(email, this.pubId),
      lastUpdated: serverTimestamp(),
    };
    try {
      await this.paymentDetailsVM.updatePaymentDetails(
        { paymentDetails: paymentDetails },
        this.pubId
      );
      Shield.remove('.skrill-form');
      this.dataUpdatedEvent.emit(true);
    } catch (error) {
      Shield.remove('.skrill-form');
      this.dataUpdatedEvent.emit(false);
      Logger.error(this, this.updatedPaymentDetails.name, error);
    }
  }

  static getSkrillForm() {
    return new UntypedFormGroup({
      emailFC: new UntypedFormControl(undefined, [
        Validators.required,
        Validators.pattern(Regex.EMAIL),
      ]),
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
