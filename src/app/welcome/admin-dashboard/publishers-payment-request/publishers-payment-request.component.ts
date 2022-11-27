import {
  ChangeDetectionStrategy,
  OnDestroy,
  Component,
  OnInit,
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

  allPaymentRequest: IPaymentRequest[] = [
    {
      paymentDetails: {
        paymentType: PaymentType.bankTransfer,
        paypalEmail: 'hello@hi.com',
        bankCountry: 'Ghana',
        // skrillEmail: 'david@gmail.com',
        bankName: 'GTBank',
        accountNumber: '5780000988',
        accountName: 'Bello Ridwan',
        residentialAddress: '18, Abolade Street Mushin',
        accountType: 'Savings',
        bankSwiftCode: 'GTBINGLA',
        bankAddress: 'Olorunsogo Mushin Lagos',
        bankRoutingNumber: '567890-09877776',
        lastUpdated: new Date().getDay(),
      },
      pubId: 'ut7578578hyjj786',
      bookName: 'Things fall Apart',
      bookId: '13546788799987676',
      sellingCurrency: 'NGN',
      amount: 2330,
    },
  ];
  readonly classes = this.sRenderer.renderSheet(STYLES, 'root');
  displayedColumns: string[] = ['position', 'payment-request'];
  bankTransfer = PaymentType.bankTransfer;

  constructor(
    private activatedRoute: ActivatedRoute,
    private paymentReqVM: PaymentRequestViewModel,
    readonly sRenderer: StyleRenderer,
    private localeService: LocaleService
  ) {}

  ngOnInit(): void {
    this.subscriptions.sink = this.activatedRoute.data
      .pipe(map((data) => data['paymentRequests']))
      .subscribe((paymentRequests) => {
        if (paymentRequests !== null) {
          this.paymentReqVM.setPaymentRequest(paymentRequests);
        }
      });

    this.subscriptions.sink = this.paymentReqVM
      .getPaymentReq$()
      .subscribe((paymentRequests) => {
        // this.allPaymentRequest = paymentRequests;
      });
  }

  markAsPaid(pubIdAndBookId: string, bookName: string) {
    const msg = this.localeService.paramTranslate(
      StringResKeys.MARK_AS_PAID_MSG,
      {
        value: bookName,
      }
    );
    const title = this.localeService.translate(
      StringResKeys.MARK_AS_PAID_TITLE
    );
    const no = this.localeService.translate(StringResKeys.NO);
    const yes = this.localeService.translate(StringResKeys.YES);

    AlertDialog.warn(msg, title, yes, no, () => {});
  }

  delete(pubIdAndBookId: string, bookName: string) {
    const no = this.localeService.translate(StringResKeys.NO);
    const yes = this.localeService.translate(StringResKeys.YES);
    const msg = this.localeService.paramTranslate(
      StringResKeys.DELETE_PAYMENT_REQ_TITLE,
      {
        value: bookName,
      }
    );
    const title = this.localeService.translate(
      StringResKeys.DELETE_PAYMENT_REQ_TITLE
    );

    AlertDialog.warn(msg, title, yes, no, () => {});
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
