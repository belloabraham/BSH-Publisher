import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { Route } from 'src/domain/data/route';
import { SubSink } from 'subsink';
import { PaymentInfoViewModel } from './payment-info.viewmodel';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PaymentInfoViewModel],
})
export class PaymentComponent implements OnInit, OnDestroy {
  private subscriptions = new SubSink();

  earnings = Route.EARNINGS;
  details = Route.DETAILS;

  constructor(
    private paymentDetailsVM: PaymentInfoViewModel,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.subscriptions.sink = this.activatedRoute.data
      .pipe(map((data) => data['paymentDetails']))
      .subscribe((paymentDetails) => {
        this.paymentDetailsVM.setPaymentDetails(paymentDetails);
      });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  
}
