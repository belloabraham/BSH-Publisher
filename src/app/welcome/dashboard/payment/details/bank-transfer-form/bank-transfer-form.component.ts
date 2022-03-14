import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-bank-transfer-form',
  templateUrl: './bank-transfer-form.component.html',
  styleUrls: ['./bank-transfer-form.component.scss'],
})
export class BankTransferFormComponent {
  @Input()
  bankTransferForm!: FormGroup;

  /*countryFC!: FormControl;
  bankAddressFC!: FormControl;
  bankNameFC!: FormControl;
  bankSwiftCodeFC!: FormControl;
  bankRoutingNumberFC!: FormControl;
  accountTypeFC!: FormControl;
  accountNameFC!: FormControl;
  accountNumberFC!: FormControl;
  addressFC!: FormControl;*/


  constructor() {}

  static getBankTransferForm() {
    return new FormGroup({
      countryFC: new FormControl(undefined, [Validators.required]),
      bankAddressFC: new FormControl(undefined, [Validators.required]),
      bankNameFC: new FormControl(undefined, [Validators.required]),
      bankSwiftCodeFC: new FormControl(undefined, [Validators.required]),
      bankRoutingNumberFC: new FormControl(undefined, [Validators.required]),
      accountTypeFC: new FormControl(undefined, [Validators.required]),
      accountNameFC: new FormControl(undefined, [Validators.required]),
      accountNumberFC: new FormControl(undefined, [Validators.required]),
      addressFC: new FormControl(undefined, [Validators.required]),
    });
  }

  submitForm() { }
  
}
