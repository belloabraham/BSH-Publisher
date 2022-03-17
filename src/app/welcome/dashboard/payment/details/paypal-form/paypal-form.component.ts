import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Regex } from 'src/domain/data/regex';

@Component({
  selector: 'app-paypal-form',
  templateUrl: './paypal-form.component.html',
  styleUrls: ['./paypal-form.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class PaypalFormComponent {
  @Input()
  payPalForm!: FormGroup;

  emailFC!: FormControl;
  hasError = false;

  constructor() {}

  submitFormData() {
    this.emailFC = this.payPalForm.get('emailFC') as FormControl;
    if (this.emailFC.valid) {
      this.hasError=false
    } else {
      this.hasError=true
    }
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
