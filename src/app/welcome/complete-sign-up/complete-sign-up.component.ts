import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Config } from 'src/data/config';
import { countries } from 'src/data/countries';
import { diallingCodes } from 'src/data/dialling-code';
import { ICanDeactivate } from 'src/guards/i-can-deactivate';
import { LocaleService } from 'src/helpers/transloco/locale.service';
import { isValidPhone } from 'src/helpers/utils/validators';
import { ICountry } from 'src/models/icountry';
import { SubSink } from 'subsink';
import { StringResKeys } from './locale/string-res-keys';

@Component({
  selector: 'app-complete-sign-up',
  templateUrl: './complete-sign-up.component.html',
  styleUrls: ['./complete-sign-up.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompleteSignUpComponent implements OnInit, OnDestroy, ICanDeactivate {
  private subscriptions = new SubSink();
  userDataForm!: FormGroup;
  validName = [Validators.required, Validators.minLength(2)];
  firstNameFC = new FormControl(undefined, this.validName);
  lastNameFC = new FormControl(undefined, this.validName);
  genderFC = new FormControl(undefined, [Validators.required]);
  phoneFC = new FormControl(undefined, [Validators.required]);
  countryFC = new FormControl(undefined, [Validators.required]);

  countries: ICountry[] = countries;
  diallingCodes: ICountry[] = diallingCodes;
  dialingCodeByCountry?= countries[0].callingCode;
  isInvalidPhoneNum = false;

  constructor(
    private title: Title,
    private localeService: LocaleService,
    private router: Router
  ) {

  }


  canExit(): Observable<boolean> | Promise<boolean> | boolean{
    if (this.userDataForm.dirty) {
      return false
    } else {
      return true;
    }
  }
 

  onCountrySelectChanged(event: any) {
    let value = event.target.value;
    this.dialingCodeByCountry = this.countries.find((country) => {
      return country.name === value;
    })?.callingCode;
  }

  onDiallinCodeSelectedChanged(event: any) {
    this.dialingCodeByCountry = event.target.value;
  }

  private isValidPhoneNumber(phoneNumber: string) {
    let countryCode = this.countries.find((country) => {
      return country.callingCode === this.dialingCodeByCountry;
    })?.code;
    return isValidPhone(phoneNumber, countryCode!, this.dialingCodeByCountry!);
  }



  submitFormData() {
    if (this.isValidPhoneNumber(this.phoneFC.value)) {
      this.isInvalidPhoneNum=false
    } else {
      this.isInvalidPhoneNum = true
    }
  }

  private generateForm() {
    return new FormGroup({
      firstNameFC: this.firstNameFC,
      lastNameFC: this.lastNameFC,
      genderFC: this.genderFC,
      phoneFC: this.phoneFC,
      countryFC: this.countryFC,
    });
  }

  ngOnInit(): void {
    this.subscriptions.sink = this.localeService
      .getIsLangLoadSuccessfullyObs()
      .subscribe((_) => {
        this.title.setTitle(
          this.localeService.paramTranslate(StringResKeys.title, {
            value: Config.appName,
          })
        );
      });
    this.userDataForm = this.generateForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
