import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { SubSink } from 'subsink';
import { PaymentRequestViewModel } from '../payment-request.service';

@Component({
  selector: 'app-publishers-payment-request',
  templateUrl: './publishers-payment-request.component.html',
  styleUrls: ['./publishers-payment-request.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublishersPaymentRequestComponent implements OnInit {
  private subscriptions = new SubSink();

  constructor(
    private activatedRoute: ActivatedRoute,
    private paymentReqVM: PaymentRequestViewModel
  ) { }

  ngOnInit(): void {
     this.subscriptions.sink = this.activatedRoute.data
       .pipe(map((data) => data['paymentRequests']))
       .subscribe((paymentRequests) => {
         if (paymentRequests) {
           this.paymentReqVM.setPaymentRequest(paymentRequests);
         }
       });
  }
}
