import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountType } from 'src/data/account-type';

@Component({
  selector: 'app-bank-tranfer-foreign-form',
  templateUrl: './bank-tranfer-foreign-form.component.html',
  styleUrls: ['./bank-tranfer-foreign-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankTranferForeignFormComponent {
  @Input()
  bankForeignForm!: FormGroup;

  @Input()
  bankAddressFC!: FormControl;
  @Input()
  bankSwiftCodeFC!: FormControl;
  @Input()
  bankRoutingNumberFC!: FormControl;
  @Input()
  accountTypeFC!: FormControl;
  @Input()
  countryFC!: FormControl;
  @Input()
  residentialAddressFC!: FormControl;

  savings = AccountType.savings;
  current = AccountType.current;

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
