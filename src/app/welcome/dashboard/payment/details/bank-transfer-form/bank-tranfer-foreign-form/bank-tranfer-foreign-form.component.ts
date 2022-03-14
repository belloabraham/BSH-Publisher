import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-bank-tranfer-foreign-form',
  templateUrl: './bank-tranfer-foreign-form.component.html',
  styleUrls: ['./bank-tranfer-foreign-form.component.scss'],
})
export class BankTranferForeignFormComponent {

  @Input()
  bankForeignForm!:FormGroup  
    
  constructor() { }
  
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
