import { LyDialog } from '@alyle/ui/dialog';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Config } from 'src/domain/data/config';
import { LocaleService } from 'src/helpers/transloco/locale.service';
import { AlertDialog } from 'src/helpers/utils/alert-dialog';
import { SubSink } from 'subsink';
import { StringResKeys } from './locale/string-res-keys';
import { ImagePickerDialogComponent } from './image-picker-dialog/image-picker-dialog.component';
import { ICanDeactivate } from 'src/app/shared/i-can-deactivate';
import { IncomingRouteService } from 'src/app/shared/incoming-route.service';
import { Regex } from 'src/domain/data/regex';
import { ImgCropperEvent } from '@alyle/ui/image-cropper';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';

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

  inValidBookCover = false;
  inValidCoverMsg = '';

  bookPublishForm!: FormGroup;
  bookCoverFC = new FormControl(undefined, [Validators.required]);
  bookDocumentFC = new FormControl(undefined, [Validators.required]);

  bookDetailsForm = new FormGroup({
    bookPriceFC: new FormControl(undefined, [Validators.required]),
    bookISBNFC: new FormControl(undefined, [Validators.pattern(Regex.ISBN)]),
    bookDescFC: new FormControl(undefined, [Validators.required]),
    bookCurrencyFC: new FormControl(undefined, [Validators.required]),
    bookTagFC: new FormControl(undefined, [Validators.required]),
    bookAuthorFC: new FormControl(undefined, [
      Validators.required,
      Validators.minLength(2),
    ]),
    bookCatgoryFC: new FormControl(undefined, [Validators.required]),
    bookNameFC: new FormControl(undefined, [Validators.required]),
  });

  private unsavedFieldsMsgTitle = '';
  private unsavedFieldsMsg = '';
  private yes = '';
  private no = '';

  private canExitRoute = new Subject<boolean>();

  isDetailsFormExpanded = true;

  private readonly PNG = 'image/png';
  private readonly MAX_COVER_FILE_SIZE_IN_KB = 70000;

  inComingRoute: string | undefined;

  cropped?: string;
  constructor(
    private _dialog: LyDialog,
    private _cd: ChangeDetectorRef,
    private title: Title,
    private localeService: LocaleService,
    private router: Router,
    private incominRouteS: IncomingRouteService
  ) {}

  chooseACoverImage(e: any) {
    this.bookCoverFC.markAsTouched();
    e.click();
  }

  openCropperDialog(event: Event) {
    this.cropped = null!;
    this.subscriptions.sink = this._dialog
      .open<ImagePickerDialogComponent, Event>(ImagePickerDialogComponent, {
        data: event,
        width: 400,
        height: 630,
        disableClose: true,
      })
      .afterClosed.subscribe((result?: ImgCropperEvent) => {
        this.checkForImageCoverValidity(result);
        if (result) {
          this._cd.markForCheck();
        }
      });
  }

  private checkForImageCoverValidity(result?: ImgCropperEvent) {
    try {
      if (result) {
        this.inValidBookCover =
          result.type! !== this.PNG ||
          result.size > this.MAX_COVER_FILE_SIZE_IN_KB;

        if (this.inValidBookCover) {
          this.inValidCoverMsg = this.localeService.paramTranslate(
            StringResKeys.imgTooLargeMsg,
            { value: `${this.MAX_COVER_FILE_SIZE_IN_KB/1000}kb` }
          );

          if (result.type !== this.PNG) {
            this.inValidCoverMsg = this.localeService.translate(
              StringResKeys.invalidImgType
            );
          }
        } else {
          this.cropped = result.dataURL
          this.inValidBookCover = false;
        }
      } else {
        this.setInvalidCoverImageTypeMsg();
      }
    } catch (error) {
      this.setInvalidCoverImageTypeMsg();
    }
  }

  private setInvalidCoverImageTypeMsg() {
     this.inValidCoverMsg = this.localeService.translate(
        StringResKeys.invalidImgType
      );
      this.inValidBookCover = true;
  }

  goBack() {
    this.router.navigateByUrl(this.incominRouteS.route);
  }

  expandAssetForm() {
    this.isDetailsFormExpanded = !this.isDetailsFormExpanded;
  }

  ngOnInit(): void {
    this.getStrinRes();
    this.bookPublishForm = this.generateBookPublishForm();
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
        value: Config.APP_NAME,
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
      bookDocumentFC: this.bookDocumentFC,
      bookCoverFC: this.bookCoverFC,
      bookDetailsForm: this.bookDetailsForm,
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
