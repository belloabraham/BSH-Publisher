import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountType } from 'src/domain/data/account-type';

@Component({
  selector: 'app-bank-tranfer-foreign-form',
  templateUrl: './bank-tranfer-foreign-form.component.html',
  styleUrls: ['./bank-tranfer-foreign-form.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class BankTranferForeignFormComponent {
  @Input()
  bankForeignForm!: FormGroup;

  savings = AccountType.savings
  current= AccountType.current

  public get bankAddressFC(): FormControl {
    return this.bankForeignForm.get('bankAddressFC') as FormControl;
  }
  public get bankSwiftCodeFC(): FormControl {
    return this.bankForeignForm.get('bankSwiftCodeFC') as FormControl;
  }

  public get addressFC(): FormControl {
    return this.bankForeignForm.get('addressFC') as FormControl;
  }
  public get accountTypeFC(): FormControl {
    return this.bankForeignForm.get('accountTypeFC') as FormControl;
  }
  public get bankRoutingNumberFC(): FormControl {
    return this.bankForeignForm.get('bankRoutingNumberFC') as FormControl;
  }

  constructor() {}

  static getBankTransferForeignForm() {
    return new FormGroup({
      bankAddressFC: new FormControl(undefined, [Validators.required]),
      bankSwiftCodeFC: new FormControl(undefined, [Validators.required]),
      bankRoutingNumberFC: new FormControl(undefined, [Validators.required]),
      accountTypeFC: new FormControl(undefined, [Validators.required]),
      addressFC: new FormControl(undefined, [Validators.required]),
    });
  }
}
