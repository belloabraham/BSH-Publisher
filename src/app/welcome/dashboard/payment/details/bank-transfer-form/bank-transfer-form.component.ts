import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { countries } from 'src/data/countries';
import { ICountry } from 'src/models/icountry';

@Component({
  selector: 'app-bank-transfer-form',
  templateUrl: './bank-transfer-form.component.html',
  styleUrls: ['./bank-transfer-form.component.scss'],
})
export class BankTransferFormComponent {
  @Input()
  bankTransferForm!: FormGroup;

  countries: ICountry[] = countries;

  public get bankNameFC(): FormControl {
    return this.bankTransferForm.get('bankNameFC') as FormControl;
  }
  public get accountNumberFC(): FormControl {
    return this.bankTransferForm.get('accountNumberFC') as FormControl;
  }

  public get accountNameFC(): FormControl {
    return this.bankTransferForm.get('accountNameFC') as FormControl;
  }

  public get countryFC(): FormControl {
    return this.bankTransferForm.get('countryFC') as FormControl;
  }

  /*
  bankAddressFC!: FormControl;
  bankSwiftCodeFC!: FormControl;
  bankRoutingNumberFC!: FormControl;
  accountTypeFC!: FormControl;
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

  submitFormData() {}
}
