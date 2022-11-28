import {
  ChangeDetectionStrategy,
  OnDestroy,
  Component,
  OnInit,
  NgZone,
  ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { SubSink } from 'subsink';
import { PaymentRequestViewModel } from './payment-request.service';
import {
  ThemeVariables,
  shadowBuilder,
  ThemeRef,
  lyl,
  dot,
  StyleRenderer,
} from '@alyle/ui';
import { IPaymentRequest } from 'src/data/models/entities/ipayment-request';
import { AlertDialog } from 'src/helpers/utils/alert-dialog';
import { LocaleService } from 'src/services/transloco/locale.service';
import { StringResKeys } from './locale/string-res-keys';
import { PaymentType } from 'src/data/payment-type';
import { countries } from 'src/data/countries';
import { NotificationBuilder } from 'src/helpers/notification/notification-buider';
import { Logger } from 'src/helpers/utils/logger';
import { Shield } from 'src/helpers/utils/shield';
import { removeItem } from 'src/helpers/utils/array';
import { Notification } from 'src/helpers/notification/notification';

const STYLES = (theme: ThemeVariables, _ref: ThemeRef) => {
  const { before, after, shadow } = theme;
  return {
    root: lyl`{
      table {
        width: 100%
        box-shadow: ${shadowBuilder(2, shadow)}
      }
      ${dot('ly-column-position')} {
        width: 32px
        border-right: 1px solid currentColor
        padding-${after}: 24px
        text-align: center
      }

      ${dot('ly-column-payment-request')} {
        padding-${before}: 0
        font-size: 20px
      }
    }`,
  };
};

@Component({
  selector: 'app-publishers-payment-request',
  templateUrl: './publishers-payment-request.component.html',
  styleUrls: ['./publishers-payment-request.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [StyleRenderer],
})
export class PublishersPaymentRequestComponent implements OnInit, OnDestroy {
  private subscriptions = new SubSink();
  nigeria = countries[0].name;

  allPaymentRequest?: IPaymentRequest[]
  readonly classes = this.sRenderer.renderSheet(STYLES, 'root');
  displayedColumns: string[] = ['position', 'payment-request'];
  bankTransfer = PaymentType.bankTransfer;

  constructor(
    private activatedRoute: ActivatedRoute,
    private paymentReqVM: PaymentRequestViewModel,
    readonly sRenderer: StyleRenderer,
    private localeService: LocaleService,
    private ngZone: NgZone,
    private _cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscriptions.sink = this.activatedRoute.data
      .pipe(map((data) => data['paymentRequests']))
      .subscribe((paymentRequests) => {
        if (paymentRequests.length > 0) {
          this.paymentReqVM.setPaymentRequest(paymentRequests);
        }
      });

    this.subscriptions.sink = this.paymentReqVM
      .getPaymentReq$()
      .subscribe((paymentRequests) => {
        this.allPaymentRequest = paymentRequests;
        this._cdRef.detectChanges();
      });
  }

  markAsPaid(paymentReq: IPaymentRequest) {
    const msg = this.localeService.paramTranslate(
      StringResKeys.MARK_AS_PAID_MSG,
      {
        value: paymentReq.bookName,
      }
    );
    const title = this.localeService.translate(
      StringResKeys.MARK_AS_PAID_TITLE
    );
    const no = this.localeService.translate(StringResKeys.NO);
    const yes = this.localeService.translate(StringResKeys.YES);

    const notification = new NotificationBuilder();

    AlertDialog.warn(msg, title, yes, no, () => {
      this.ngZone.run(async () => {
        try {
          const markingMsg = this.localeService.translate(
            StringResKeys.MARKING_PAYMENT_REQ_AS_PAID
          );
          Shield.pulse(`.${paymentReq.id}`, markingMsg);
          await this.paymentReqVM.updateEarningAndDeletePaymentReqForBookTrans(
            paymentReq.pubId,
            paymentReq.bookId,
            paymentReq.amount
          );
          const successMsg = this.localeService.paramTranslate(
            StringResKeys.PAYMENT_REQ_MARK_PAID_SUCCESS_MSG,
            {
              value: paymentReq.bookName,
            }
          );
          this.allPaymentRequest = removeItem(
            this.allPaymentRequest!,
            paymentReq
          ).concat([]);
          this.paymentReqVM.setPaymentRequest(this.allPaymentRequest);
          notification.setTimeOut(Notification.SHORT_LENGHT);
          notification.build().success(successMsg);
        } catch (error) {
          Logger.error(this, this.markAsPaid.name, error);
          const errorMsg = this.localeService.paramTranslate(
            StringResKeys.PAYMENT_REQ_MARK_PAID_FAILED_MSG,
            {
              value: paymentReq.bookName,
            }
          );
          notification.build().error(errorMsg);
        } finally {
          Shield.remove(`.${paymentReq.id}`);
        }
      });
    });
  }

  delete(paymentReq: IPaymentRequest) {
    const no = this.localeService.translate(StringResKeys.NO);
    const yes = this.localeService.translate(StringResKeys.YES);
    const msg = this.localeService.paramTranslate(
      StringResKeys.DELETE_PAYMENT_REQ_MSG,
      {
        value: paymentReq.bookName,
      }
    );
    const title = this.localeService.translate(
      StringResKeys.DELETE_PAYMENT_REQ_TITLE
    );

    const notification = new NotificationBuilder();
    AlertDialog.warn(msg, title, yes, no, () => {
      this.ngZone.run(async () => {
        try {
          const deletingMsg = this.localeService.translate(
            StringResKeys.DELETING_PAYMENT_REQUEST
          );
          Shield.pulse(`.${paymentReq.id}`, deletingMsg);
          await this.paymentReqVM.deletePaymentRequest(paymentReq.bookId);
          const successMsg = this.localeService.paramTranslate(
            StringResKeys.PAYMENT_REQ_DELETE_SUCCESS_MSG,
            {
              value: paymentReq.bookName,
            }
          );
          this.allPaymentRequest = removeItem(
            this.allPaymentRequest!,
            paymentReq
          ).concat([]);
          this.paymentReqVM.setPaymentRequest(this.allPaymentRequest);
          notification.setTimeOut(Notification.SHORT_LENGHT);
          notification.build().success(successMsg);
        } catch (error) {
          Logger.error(this, this.delete.name, error);

          const errorMsg = this.localeService.paramTranslate(
            StringResKeys.PAYMENT_REQ_DELETE_FAILED_MSG,
            {
              value: paymentReq.bookName,
            }
          );
          notification.build().error(errorMsg);
        } finally {
          Shield.remove(`.${paymentReq.id}`);
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
