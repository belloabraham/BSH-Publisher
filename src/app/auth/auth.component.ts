import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Config } from 'src/data/config';
import { Regex } from 'src/data/regex';
import { Settings } from 'src/data/settings';
import { LocaleService } from 'src/helpers/transloco/locale.service';
import { AlertDialog } from 'src/helpers/utils/alert-dialog';
import { Logger } from 'src/helpers/utils/logger';
import { Shield } from 'src/helpers/utils/shield';
import { IUserAuth } from 'src/services/authentication/iuser-auth';
import { USER_AUTH_IJTOKEN } from 'src/services/authentication/user-auth.token';
import { SubSink } from 'subsink';
import { StringResKeys } from './locale/string-res-keys';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent implements OnInit, OnDestroy {
  private subscriptions = new SubSink();
  hasError = false;
  user = this.userAuth.getPubId();
  ok = '';
  signInErrorTitle = '';

  emailSignInForm!: FormGroup;
  emailFC = new FormControl('', [
    Validators.required,
    Validators.pattern(Regex.email),
  ]);

  constructor(
    private title: Title,
    @Inject(USER_AUTH_IJTOKEN) private userAuth: IUserAuth,
    private localeService: LocaleService,
  ) {
  }

  ngOnInit(): void {
    this.getStringRes();
    this.emailSignInForm = this.generateForm();
  }

  private setTitle() {
    this.title.setTitle(
      this.localeService.paramTranslate(StringResKeys.title, {
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

  async signInWithGoogleRedirect() {
    try {
      await this.userAuth.signInWithGoogleRedirect();
    } catch (error: any) {
      Logger.error(this, 'signInWithGoogleRedirect', error.message);
      const message = this.userAuth.getErrorMessage(error);
      AlertDialog.error(message, this.signInErrorTitle, this.ok, {
        plainText: false,
      });
    }
  }

  async signInWithEmail() {
    if (this.emailSignInForm.valid) {
      this.hasError = false;
      var email = this.emailFC.value + ''.trim();
      await this.sendSignInLinkToEmail(email);
    } else {
      this.hasError = true;
    }
  }

  async sendSignInLinkToEmail(email: string) {
    Shield.standard()
    try {
      await this.userAuth.sendSignInLinkToEmail(email);
      localStorage.setItem(Settings.userEmail, email);
      Shield.remove();
      this.showMailSentSuccessMessage(email)
    } catch (error: any) {
      Shield.remove();
      Logger.error(this, 'sendSignInLinkToEmail', error.message);
      const message = this.userAuth.getErrorMessage(error);
      AlertDialog.error(message, this.signInErrorTitle, this.ok, {
        plainText: false,
      });
    }
  }

  private showMailSentSuccessMessage(email:string) {
     const title = this.localeService.paramTranslate(
       StringResKeys.linkSentTitle,
       {
         value: email,
       }
     );
     const msg = this.localeService.paramTranslate(StringResKeys.linkSentMsg, {
       value: email,
     });

     AlertDialog.success(msg, title, this.ok, {
       plainText: false,
     });
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
