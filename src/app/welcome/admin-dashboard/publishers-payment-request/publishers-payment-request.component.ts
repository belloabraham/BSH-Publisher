import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-publishers-payment-request',
  templateUrl: './publishers-payment-request.component.html',
  styleUrls: ['./publishers-payment-request.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PublishersPaymentRequestComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log();
    
  }

}
