import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Regex } from 'src/data/regex';

@Component({
  selector: 'app-paypal-form',
  templateUrl: './paypal-form.component.html',
  styleUrls: ['./paypal-form.component.scss'],
})
export class PaypalFormComponent {

  @Input()
  payPalForm: FormGroup | undefined;

  emailFC!: FormControl;

  constructor() {}

  submitForm() {
    this.emailFC = this.payPalForm?.get('emailFC') as FormControl;
  }

  static getPayPalForm() {
    return new FormGroup({
      emailFC: new FormControl(undefined, [
        Validators.required,
        Validators.pattern(Regex.email),
      ]),
    });
  }
}
