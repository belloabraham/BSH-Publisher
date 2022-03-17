import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Regex } from 'src/domain/data/regex';

@Component({
  selector: 'app-skrill-form',
  templateUrl: './skrill-form.component.html',
  styleUrls: ['./skrill-form.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class SkrillFormComponent  {
  @Input()
  skrillForm!: FormGroup;

  emailFC!: FormControl;

  hasError =false

  constructor() {}

  static getSkrillForm() {
    return new FormGroup({
      emailFC: new FormControl(undefined, [
        Validators.required,
        Validators.pattern(Regex.email),
      ]),
    });
  }

  submitFormData() {
    this.emailFC = this.skrillForm.get('emailFC') as FormControl;
     if (this.emailFC.valid) {
       this.hasError = false;
     } else {
       this.hasError = true;
     }
  }
}
