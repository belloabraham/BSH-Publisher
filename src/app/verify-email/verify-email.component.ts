import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Config } from 'src/data/config';
import { Regex } from 'src/data/regex';
import { Route } from 'src/data/route';
import { Settings } from 'src/data/settings';
import { LocaleService } from 'src/helpers/transloco/locale.service';
import { AlertDialog } from 'src/helpers/utils/alert-dialog';
import { Logger } from 'src/helpers/utils/logger';
import { Shield } from 'src/helpers/utils/shield';
import { ErrorCodes } from 'src/services/authentication/firebase/error-codes';
import { IUserAuth } from 'src/services/authentication/iuser-auth';
import { USER_AUTH } from 'src/services/authentication/user-auth.token';
import { SubSink } from 'subsink';
import { StringResKeys } from '../auth/locale/string-res-keys';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyEmailComponent implements OnInit, OnDestroy {
  private subscriptions = new SubSink();
  verifyEmailForm!: FormGroup;
  emailFC = new FormControl('', [
    Validators.required,
    Validators.pattern(Regex.email),
  ]);
  hasError = false;
  signInErrorTitle = '';
  ok = '';
  
  constructor(
    private title: Title,
    private localeService: LocaleService,
    @Inject(USER_AUTH) private userAuth: IUserAuth,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getStringRes();
    this.verifyEmailForm = this.generateForm();
  }

  private setTitle() {
    this.title.setTitle(
      this.localeService.paramTranslate(StringResKeys.verifyEmailTitle, {
        value: Config.appName,
      })
    );
  }

  private getStringRes() {
    this.subscriptions.sink = this.localeService
      .getIsLangLoadSuccessfullyObs()
      .subscribe((_) => {
        this.setTitle();
        this.translateStringRes();
      });
  }

  private translateStringRes() {
    this.ok = this.localeService.translate(StringResKeys.ok);
        this.signInErrorTitle = this.localeService.translate(
          StringResKeys.signInErrorTitle
        );
  }

  verifyEmail() {
    if (this.verifyEmailForm.valid) {
      this.hasError = false;
      var email = this.emailFC.value + ''.trim();
      this.verifyEmailWithLink(email);
    } else {
      this.hasError = true;
    }
  }

  private async verifyEmailWithLink(email: string) {
    Shield.standard()
    try {
      await this.userAuth.signInWithEmailLink(email, location.href);
      localStorage.removeItem(Settings.userEmail);
      Shield.remove()
      this.router.navigateByUrl(Route.welcome);
    } catch (error: any) {
      Shield.remove()
      this.showEmailSignInErrorMsg(error)
    }
  }

  private showEmailSignInErrorMsg(error:any) {
    if (error.code === ErrorCodes.argumentError) {
      this.hasError = true;
    } else {
      Logger.error(this, 'verifyEmailWithLink', error);
      const message = this.userAuth.getErrorMessage(error);
      AlertDialog.error(message, this.signInErrorTitle, this.ok, {
        plainText: false,
      });
    }
  }

  private generateForm() {
    return new FormGroup({
      emailFC: this.emailFC,
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
