import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Config } from 'src/domain/data/config';
import { ICanDeactivate } from 'src/guards/i-can-deactivate';
import { LocaleService } from 'src/helpers/transloco/locale.service';
import { AlertDialog } from 'src/helpers/utils/alert-dialog';
import { SubSink } from 'subsink';
import { StringResKeys } from './locale/string-res-keys';

@Component({
  selector: 'app-publish-your-book',
  templateUrl: './publish-your-book.component.html',
  styleUrls: ['./publish-your-book.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublishYourBookComponent
  implements OnInit, OnDestroy, ICanDeactivate
{
  private subscriptions = new SubSink();

  bookPublishForm!: FormGroup;

  bookNameFC = new FormControl(undefined, [Validators.required]);
  bookDescFC = new FormControl(undefined, [Validators.required]);
  bookCurrencyFC = new FormControl(undefined, [Validators.required]);
  bookAuthorFC = new FormControl(undefined, [Validators.required]);

  bookISBNFC = new FormControl(undefined, [Validators.required]);
  bookCatgoryFC = new FormControl(undefined, [Validators.required]);
  bookPriceFC = new FormControl(undefined, [Validators.required]);

  bookTagFC = new FormControl(undefined, [Validators.required]);
  bookCoverFC = new FormControl(undefined, [Validators.required]);
  bookDocumentFC = new FormControl(undefined, [Validators.required]);

  private unsavedFieldsMsgTitle = '';
  private unsavedFieldsMsg = '';
  private yes = '';
  private no = '';

  private canExitRoute = new Subject<boolean>();

  isContentFormValid = false
  isContentFormExpand = true

  constructor(
    private title: Title,
    private localeService: LocaleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getStrinRes();
    this.bookPublishForm = this.generateBookPublishForm()
  }

  private getStrinRes() {
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

  canExit(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.bookPublishForm.dirty) {
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

  private generateBookPublishForm() {
    return new FormGroup({
      bookDetailsForm: new FormGroup({
        bookPriceFC: this.bookPriceFC,
        bookISBNFC: this.bookISBNFC,
        bookDescFC: this.bookDescFC,
        bookCurrencyFC: this.bookCurrencyFC,
        bookTagFC: this.bookTagFC,
        bookAuthorFC: this.bookAuthorFC,
        bookCatgoryFC: this.bookCatgoryFC,
        bookNameFC: this.bookNameFC,
      }),
      bookAssetsForm: new FormGroup({
        bookCoverFC: this.bookCoverFC,
        bookDocumentFC: this.bookDocumentFC,
      }),
    });
  }

  private translateStringRes() {
    this.no = this.localeService.translate(StringResKeys.no);
    this.yes = this.localeService.translate(StringResKeys.yes);
    this.unsavedFieldsMsg = this.localeService.translate(
      StringResKeys.unsavedFieldsMsg
    );
    this.unsavedFieldsMsgTitle = this.localeService.translate(
      StringResKeys.unsavedFieldsMsgTitle
    );
  }

  submitFormData() {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
