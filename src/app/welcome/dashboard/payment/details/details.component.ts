import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  addPaymentDetailsClick = false
  paymentDeatilsForm!: FormGroup;

  constructor() { }

  ngOnInit(): void {
    console.log('')
  }

  addPaymentDetails() {
    this.addPaymentDetailsClick = true
  }

}
