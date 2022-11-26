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
  shadowBuilder, ThemeRef,
  lyl,
  dot,
  StyleRenderer,
} from '@alyle/ui';
import { IPaymentRequest } from 'src/data/models/entities/ipayment-request';

export interface Star {
  position: number;
  name: string;
  radius: number;
  temperature: number;
}

const ELEMENT_DATA: Star[] = [
  { position: 1, name: 'Things Fall Apart', radius: 1708, temperature: 3365 },
  { position: 2, name: 'Tunde on The Run', radius: 1420, temperature: 3490 },
  { position: 3, name: 'We were soldiers', radius: 1260, temperature: 3690 },
  { position: 4, name: 'Death By A Thousand Cuts', radius: 887, temperature: 3500 },
  { position: 5, name: 'New General Mathematics', radius: 680, temperature: 3600 },
  { position: 6, name: 'Mordern Chemistry', radius: 420, temperature: 11800 },
  { position: 7, name: '50 Shades of Grey', radius: 78.9, temperature: 11000 },
  { position: 8, name: 'Essential Physics', radius: 45.1, temperature: 3910 },
  { position: 9, name: 'Spiritual Daily Digest August - December', radius: 25.4, temperature: 4286 },
  { position: 10, name: 'Pollux', radius: 9.06, temperature: 4586 },
  { position: 11, name: 'Sometimes in April', radius: 1, temperature: 5778 },
];



const STYLES = (theme: ThemeVariables, _ref: ThemeRef) => {
  const { before, after, shadow } = theme;
  return {
    root: lyl `{
      table {
        width: 100%
        box-shadow: ${shadowBuilder(2, shadow)}
      }
      ${dot('ly-column-demo-position')} {
        width: 32px
        border-right: 1px solid currentColor
        padding-${after}: 24px
        text-align: center
      }

      ${dot('ly-column-demo-name')} {
        padding-${before}: 0
        font-size: 20px
      }
    }`
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

  allPaymentRequest: IPaymentRequest[] = [];
  readonly classes = this.sRenderer.renderSheet(STYLES, 'root');
  displayedColumns: string[] = [
    'demo-position',
    'demo-name',
  ];
  dataSource = ELEMENT_DATA;

  constructor(
    private activatedRoute: ActivatedRoute,
    private paymentReqVM: PaymentRequestViewModel,
    readonly sRenderer: StyleRenderer,
  ) {}

  ngOnInit(): void {
    this.subscriptions.sink = this.activatedRoute.data
      .pipe(map((data) => data['paymentRequests']))
      .subscribe((paymentRequests) => {
        if (paymentRequests) {
          this.paymentReqVM.setPaymentRequest(paymentRequests);
        }
      });

    this.subscriptions.sink = this.paymentReqVM
      .getPaymentReq$()
      .subscribe((paymentRequests) => {
        this.allPaymentRequest = paymentRequests;
      });
  }

  markAsPaid(pubIdAndBookId: string) {}

  delete(pubIdAndBookId: string) {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
