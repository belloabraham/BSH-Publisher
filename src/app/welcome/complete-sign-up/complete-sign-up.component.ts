import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { UserDataFormComponent } from 'src/app/shared/user-data-form/user-data-form.component';
import { Config } from 'src/data/config';
import { Route } from 'src/data/route';
import { LocaleService } from 'src/helpers/transloco/locale.service';
import { AlertDialog } from 'src/helpers/utils/alert-dialog';
import { SubSink } from 'subsink';
import { StringResKeys } from './locale/string-res-keys';

@Component({
  selector: 'app-complete-sign-up',
  templateUrl: './complete-sign-up.component.html',
  styleUrls: ['./complete-sign-up.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompleteSignUpComponent
  implements OnInit, OnDestroy
{
  private subscriptions = new SubSink();

  completeSignUpForm!: FormGroup;
  userDataForm!: FormGroup;
  action=''

  canExitRoute = new Subject<boolean>();

  private ok = '';
  private submitFormErrorMsg = '';
  private error = '';



  constructor(
    private title: Title,
    private localeService: LocaleService,
    private router:Router
  ) {}

  onDataUpdate(isSuccessful:boolean) {
    if (isSuccessful) {
        this.router.navigate([Route.root, Route.welcome, Route.dashboard]);
    } else {
      AlertDialog.error(this.submitFormErrorMsg, this.error, this.ok);
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
    this.error = this.localeService.translate(StringResKeys.error);
    this.ok = this.localeService.translate(StringResKeys.ok);
    this.submitFormErrorMsg = this.localeService.translate(
      StringResKeys.submitFormErrorMsg
    );
     this.action = this.localeService.translate(StringResKeys.continue);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
