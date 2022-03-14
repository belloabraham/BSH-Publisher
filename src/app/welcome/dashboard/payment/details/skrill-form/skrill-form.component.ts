import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Regex } from 'src/data/regex';

@Component({
  selector: 'app-skrill-form',
  templateUrl: './skrill-form.component.html',
  styleUrls: ['./skrill-form.component.scss'],
})
export class SkrillFormComponent  {
  @Input()
  skrillForm!: FormGroup;

  emailFC!: FormControl;

  constructor() {}

  static getSkrillForm() {
    return new FormGroup({
      emailFC: new FormControl(undefined, [
        Validators.required,
        Validators.pattern(Regex.email),
      ]),
    });
  }

  submitForm() {
    this.emailFC = this.skrillForm?.get('emailFC') as FormControl;
  }
}
