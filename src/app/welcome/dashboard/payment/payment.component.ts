import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Route } from 'src/data/route';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentComponent {

  earnings = Route.EARNINGS;
  details = Route.DETAILS;

  constructor(
  ) {}
}
