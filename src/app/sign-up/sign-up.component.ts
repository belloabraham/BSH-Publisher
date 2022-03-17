import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { serverTimestamp } from '@angular/fire/firestore';
import { FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { UserDataFormComponent } from 'src/app/shared/user-data-form/user-data-form.component';
import { Config } from 'src/domain/data/config';
import { Route } from 'src/domain/data/route';
import { DATABASE_IJTOKEN } from 'src/domain/remote-data-source/database.token';
import { FirestoreService } from 'src/domain/remote-data-source/firebase/firestore.service';
import { LocaleService } from 'src/helpers/transloco/locale.service';
import { AlertDialog } from 'src/helpers/utils/alert-dialog';
import { SubSink } from 'subsink';
import { StringResKeys } from '../sign-up/locale/string-res-keys';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  providers: [
    {
      provide: DATABASE_IJTOKEN,
      useClass: FirestoreService,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpComponent implements OnInit, OnDestroy {
  private subscriptions = new SubSink();

  completeSignUpForm!: FormGroup;
  userDataForm!: FormGroup;
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
      this.router.navigate([Route.root, Route.welcome, Route.dashboard]);
    } else {
      AlertDialog.error(this.submitFormErrorMsg, this.error, this.ok);
    }
  }

  ngOnInit(): void {
    this.getStringRes()

    this.completeSignUpForm = new FormGroup({
      userDataForm: UserDataFormComponent.getUserDataForm(),
    });

    this.userDataForm = this.completeSignUpForm.get(
      'userDataForm'
    ) as FormGroup;
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
        value: Config.appName,
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
