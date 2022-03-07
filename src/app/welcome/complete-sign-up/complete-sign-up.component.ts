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
import { UserDataFormComponent } from 'src/app/shared/user-data-form/user-data-form.component';
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

  completeSignUpForm!: FormGroup;

  userDataForm!: FormGroup;

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
  ) {}

  canExit(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.completeSignUpForm.dirty) {
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



  ngOnInit(): void {
    this.subscriptions.sink = this.localeService
      .getIsLangLoadSuccessfullyObs()
      .subscribe((_) => {
        this.setTitle();
        this.translateStringRes();
      });
    
     this.completeSignUpForm = new FormGroup({
       userDataForm: UserDataFormComponent.getUserDataForm(),
     });
    
     this.userDataForm = this.completeSignUpForm.get('userDataForm') as FormGroup;
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
