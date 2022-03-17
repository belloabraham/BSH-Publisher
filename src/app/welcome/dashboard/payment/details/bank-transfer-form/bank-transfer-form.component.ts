import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { countries } from 'src/domain/data/countries';
import { ICountry } from 'src/domain/models/icountry';
import { SubSink } from 'subsink';
import { BankTranferForeignFormComponent } from './bank-tranfer-foreign-form/bank-tranfer-foreign-form.component';

@Component({
  selector: 'app-bank-transfer-form',
  templateUrl: './bank-transfer-form.component.html',
  styleUrls: ['./bank-transfer-form.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class BankTransferFormComponent implements OnDestroy, OnInit {
  @Input()
  bankTransferForm!: FormGroup;

  private subscriptions = new SubSink();

  countries: ICountry[] = countries;
  private nigeria = this.countries[0].name;

  private bankTrasnferForeignFormName = 'bankTrasnferForeignFormName';

  public get bankForeignForm(): FormGroup | null {
    let value = this.bankTransferForm.get(this.bankTrasnferForeignFormName);
    return value ? (value as FormGroup) : null;
  }

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

  constructor() {}

  ngOnInit(): void {
    this.onCountrySelectedChanges();
  }

  onCountrySelectedChanges() {
    this.subscriptions.sink = this.countryFC.valueChanges.subscribe((value) => {
      if (value !== this.nigeria) {
        this.bankTransferForm.addControl(
          this.bankTrasnferForeignFormName,
          BankTranferForeignFormComponent.getBankTransferForeignForm()
        );
      } else {
        this.bankTransferForm.removeControl(
          this.bankTrasnferForeignFormName
        );
      }
    });
  }

  static getBankTransferForm() {
    return new FormGroup({
      countryFC: new FormControl(undefined, [Validators.required]),
      bankNameFC: new FormControl(undefined, [Validators.required]),
      accountNameFC: new FormControl(undefined, [Validators.required]),
      accountNumberFC: new FormControl(undefined, [Validators.required]),
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  submitFormData() {}
}
