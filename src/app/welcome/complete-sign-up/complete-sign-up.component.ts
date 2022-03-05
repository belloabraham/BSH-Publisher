import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { serverTimestamp } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Config } from 'src/data/config';
import { countries } from 'src/data/countries';
import { diallingCodes } from 'src/data/dialling-code';
import { Route } from 'src/data/route';
import { ICanDeactivate } from 'src/guards/i-can-deactivate';
import { LocaleService } from 'src/helpers/transloco/locale.service';
import { AlertDialog } from 'src/helpers/utils/alert-dialog';
import { Logger } from 'src/helpers/utils/logger';
import { Shield } from 'src/helpers/utils/shield';
import { isValidPhone } from 'src/helpers/utils/validators';
import { ICountry } from 'src/models/icountry';
import { IUser } from 'src/models/iuser';
import { IUserAuth } from 'src/services/authentication/iuser-auth';
import { USER_AUTH_IJTOKEN } from 'src/services/authentication/user-auth.token';
import { Collection } from 'src/services/database/collection';
import { DATABASE_IJTOKEN } from 'src/services/database/database.token';
import { IDatabase } from 'src/services/database/idatabase';
import { SubSink } from 'subsink';
import { StringResKeys } from './locale/string-res-keys';

@Component({
  selector: 'app-complete-sign-up',
  templateUrl: './complete-sign-up.component.html',
  styleUrls: ['./complete-sign-up.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompleteSignUpComponent
  implements OnInit, OnDestroy, ICanDeactivate
{
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
  dialingCodeByCountry? = countries[0].callingCode;
  isInvalidPhoneNum = false;

  canExitRoute = new Subject<boolean>();

  private unsavedFieldsMsgTitle = '';
  private unsavedFieldsMsg = '';
  private yes = '';
  private no = '';
  private ok = '';
  private submitFormErrorMsg = '';
  private error = '';

  constructor(
    private title: Title,
    private localeService: LocaleService,
    private router: Router,
    @Inject(DATABASE_IJTOKEN) private database: IDatabase,
    @Inject(USER_AUTH_IJTOKEN) private userAuth: IUserAuth
  ) {}

  canExit(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.userDataForm.dirty) {
      console.log(this);
      AlertDialog.warn(
        this.unsavedFieldsMsg,
        this.unsavedFieldsMsgTitle,
        this.yes,
        this.no,
        () => this.canExitRoute.next(true),
        () => this.canExitRoute.next(false)
      );
      return this.canExitRoute;
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

  async submitFormData() {

    if (this.isValidPhoneNumber(this.phoneFC.value)) {

      Shield.standard()
      
       this.isInvalidPhoneNum = false;

      let userId = this.userAuth.getPubId()!;
      let email = this.userAuth.getEmail()!;

      let user: IUser = {
        firstName: this.firstNameFC.value,
        lastName: this.lastNameFC.value,
        gender: this.genderFC.value,
        nationality: this.countryFC.value,
        phoneNumber: this.phoneFC.value,
        email: email,
        registeredDate: serverTimestamp(),
      };

     try {
        await this.database.addDocData<IUser>(
          Collection.publishers,
          [userId],
          user
        );
       
       Shield.remove();
       
         this.router.navigate([
           Route.root,
           Route.welcome,
           Route.dashboard,
         ]);
     } catch (error: any) {
       Shield.remove();
        Logger.error(this, 'submitFormData', error);
        AlertDialog.error(this.submitFormErrorMsg, this.error, this.ok);
      }
    } else {
      this.isInvalidPhoneNum = true;
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
        this.setTitle();
        this.translateStringRes();
      });
    this.userDataForm = this.generateForm();
  }

  private setTitle() {
    this.title.setTitle(
      this.localeService.paramTranslate(StringResKeys.title, {
        value: Config.appName,
      })
    );
  }

  private translateStringRes() {
    this.no = this.localeService.translate(StringResKeys.no);
    this.yes = this.localeService.translate(StringResKeys.yes);
    this.error = this.localeService.translate(StringResKeys.error);
    this.ok = this.localeService.translate(StringResKeys.ok);
    this.submitFormErrorMsg = this.localeService.translate(
      StringResKeys.submitFormErrorMsg
    );
    this.unsavedFieldsMsg = this.localeService.translate(
      StringResKeys.unsavedFieldsMsg
    );
    this.unsavedFieldsMsgTitle = this.localeService.translate(
      StringResKeys.unsavedFieldsMsgTitle
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
