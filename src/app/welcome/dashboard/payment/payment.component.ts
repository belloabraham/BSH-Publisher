import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Route } from 'src/domain/data/route';
import { PaymentInfoViewModel } from './payment-info.viewmodel';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers:[PaymentInfoViewModel]
})
export class PaymentComponent {
  earnings = Route.earnings;
  details = Route.details;

  constructor() {}
}
