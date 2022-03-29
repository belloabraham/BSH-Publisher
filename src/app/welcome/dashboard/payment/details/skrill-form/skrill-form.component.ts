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
  selector: 'app-skrill-form',
  templateUrl: './skrill-form.component.html',
  styleUrls: ['./skrill-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkrillFormComponent implements OnInit, OnDestroy {
  private subscriptions = new SubSink();

  private pubId = this.userAuth.getPubId()!;

  @Input()
  skrillForm!: FormGroup;

  @Output()
  dataUpdatedEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  emailFC!: FormControl;

  hasError = false;

  constructor(
    private paymentDetailsVM: PaymentInfoViewModel,
    @Inject(USER_AUTH_IJTOKEN) private userAuth: IUserAuth
  ) {}

  ngOnInit(): void {
    this.emailFC = this.skrillForm.get('emailFC') as FormControl;
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
      await this.updatedPaymentDetails(this.emailFC.value);
    } else {
      this.hasError = true;
    }
  }

  private async updatedPaymentDetails(email: string) {
    Shield.standard('.skrill-form');
    let paymentDetails: IPaymentDetails = {
      paymentType: PaymentType.skrill,
      skrillEmail: CryptoUtil.getEncrypted(email, this.pubId),
      lastUpdated: serverTimestamp(),
    };
    try {
      await this.paymentDetailsVM.updatePaymentDetails(
        paymentDetails,
        this.pubId
      );
      Shield.remove('.skrill-form');
      this.paymentDetailsVM.setPaymentDetails(paymentDetails);
      this.dataUpdatedEvent.emit(true);
    } catch (error) {
      Shield.remove('.skrill-form');
      this.dataUpdatedEvent.emit(false);
      Logger.error(this, this.updatedPaymentDetails.name, error);
    }
  }

  static getSkrillForm() {
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
