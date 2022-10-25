import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AccountType } from 'src/data/account-type';

@Component({
  selector: 'app-bank-tranfer-foreign-form',
  templateUrl: './bank-tranfer-foreign-form.component.html',
  styleUrls: ['./bank-tranfer-foreign-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankTranferForeignFormComponent {
  @Input()
  bankForeignForm!: UntypedFormGroup;

  @Input()
  bankAddressFC!: UntypedFormControl;
  @Input()
  bankSwiftCodeFC!: UntypedFormControl;
  @Input()
  bankRoutingNumberFC!: UntypedFormControl;
  @Input()
  accountTypeFC!: UntypedFormControl;
  @Input()
  countryFC!: UntypedFormControl;
  @Input()
  residentialAddressFC!: UntypedFormControl;

  savings = AccountType.savings;
  current = AccountType.current;

  constructor() {}

  static getBankTransferForeignForm() {
    return new UntypedFormGroup({
      bankAddressFC: new UntypedFormControl(undefined, [Validators.required]),
      bankSwiftCodeFC: new UntypedFormControl(undefined, [Validators.required]),
      bankRoutingNumberFC: new UntypedFormControl(undefined, [Validators.required]),
      accountTypeFC: new UntypedFormControl(undefined, [Validators.required]),
      residentialAddressFC: new UntypedFormControl(undefined, [Validators.required]),
    });
  }
}
