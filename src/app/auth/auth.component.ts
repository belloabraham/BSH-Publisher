import { ChangeDetectionStrategy, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Config } from 'src/data/config';
import { Regex } from 'src/data/regex';
import { LocaleService } from 'src/helpers/transloco/locale.service';
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

  emailSignInForm!: FormGroup;
  emailFC = new FormControl('', [
    Validators.required,
    Validators.pattern(Regex.email),
  ]);

  constructor(private title: Title, private localeService: LocaleService, private ngZone:NgZone) {}

  ngOnInit(): void {

    this.emailSignInForm = this.generateForm();

    this.subscriptions.sink = this.localeService
      .getIsLangLoadSuccessfullyObs()
      .subscribe((_) => {
        this.title.setTitle(
          this.localeService.paramTranslate(StringResKeys.title, {
            value: Config.appName,
          })
        );
      });
  }

  signInWithGoogleRedirect() {
    this.ngZone.runOutsideAngular(() => {
      

    });
  }

  sendSignInLinkToEmail() {
    //console.log(this.emailSignInForm.)
  }

  generateForm() {
    return new FormGroup({
      emailFC: this.emailFC
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
