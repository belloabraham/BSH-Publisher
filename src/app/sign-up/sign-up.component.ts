import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { serverTimestamp } from '@angular/fire/firestore';
import { UntypedFormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { UserDataFormComponent } from 'src/app/shared/user-data-form/user-data-form.component';
import { Config } from 'src/data/config';
import { Route } from 'src/data/route';
import { LocaleService } from 'src/services/transloco/locale.service';
import { AlertDialog } from 'src/helpers/utils/alert-dialog';
import { SubSink } from 'subsink';
import { StringResKeys } from '../sign-up/locale/string-res-keys';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpComponent implements OnInit, OnDestroy {
  private subscriptions = new SubSink();

  completeSignUpForm!: UntypedFormGroup;
  userDataForm!: UntypedFormGroup;
  action = '';
  registeredDate = serverTimestamp();
  lastUpdated = null;

  private ok = '';
  private submitFormErrorMsg = '';
  private error = '';

  constructor(
    private title: Title,
    private localeService: LocaleService,
    private router: Router
  ) {}

  onDataUpdate(isSuccessful: boolean) {
    if (isSuccessful) {
      this.router.navigate([Route.ROOT, Route.WELCOME, Route.DASHBOARD]);
    } else {
      AlertDialog.error(this.submitFormErrorMsg, this.error, this.ok);
    }
  }

  ngOnInit(): void {
    this.getStringRes();

    this.completeSignUpForm = new UntypedFormGroup({
      userDataForm: UserDataFormComponent.getUserDataForm(),
    });
    this.userDataForm = this.completeSignUpForm.get(
      'userDataForm'
    ) as UntypedFormGroup;
  }

  private getStringRes() {
    this.subscriptions.sink = this.localeService
      .getIsLangLoadSuccessfullyObs()
      .subscribe((_) => {
        this.setTitle();
        this.translateStringRes();
      });
  }

  private setTitle() {
    this.title.setTitle(
      this.localeService.paramTranslate(StringResKeys.title, {
        value: Config.APP_NAME,
      })
    );
  }

  private translateStringRes() {
    this.error = this.localeService.translate(StringResKeys.error);
    this.ok = this.localeService.translate(StringResKeys.ok);
    this.submitFormErrorMsg = this.localeService.translate(
      StringResKeys.submitFormErrorMsg
    );
    this.action = this.localeService.translate(StringResKeys.signUp);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
