import { LyDialog } from '@alyle/ui/dialog';
import { ImgCropperConfig, ImgCropperErrorEvent, ImgCropperEvent } from '@alyle/ui/image-cropper';
import { Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import {  Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Config } from 'src/domain/data/config';
import { LocaleService } from 'src/helpers/transloco/locale.service';
import { AlertDialog } from 'src/helpers/utils/alert-dialog';
import { SubSink } from 'subsink';
import { StringResKeys } from './locale/string-res-keys';
import { ImagePickerDialogComponent } from './image-picker-dialog/image-picker-dialog.component';
import { ICanDeactivate } from 'src/app/shared/i-can-deactivate';

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
  bookCoverFC = new FormControl(undefined, [Validators.required]);
  bookDocumentFC = new FormControl(undefined, [Validators.required, Validators.max(51200)]);

  bookDetailsForm = new FormGroup({
    bookPriceFC: new FormControl(undefined, [Validators.required]),
    bookISBNFC: new FormControl(undefined),
    bookDescFC: new FormControl(undefined, [Validators.required]),
    bookCurrencyFC: new FormControl(undefined, [Validators.required]),
    bookTagFC: new FormControl(undefined, [Validators.required]),
    bookAuthorFC: new FormControl(undefined, [Validators.required]),
    bookCatgoryFC: new FormControl(undefined, [Validators.required]),
    bookNameFC: new FormControl(undefined, [Validators.required]),
  });

  private unsavedFieldsMsgTitle = '';
  private unsavedFieldsMsg = '';
  private yes = '';
  private no = '';

  private canExitRoute = new Subject<boolean>();

  isDetailsFormExpanded = true;

  inComingRoute: string | undefined;

  cropped?: string;
  constructor(
    private _dialog: LyDialog,
    private _cd: ChangeDetectorRef,
    private title: Title,
    private localeService: LocaleService,
    private router: Router,
    private location: Location
  ) {}

  ready!: boolean;
  scale: any =0;
  minScale!: number;
  //@ViewChild(LyImageCropper, { static: true }) cropper: LyImageCropper;
  myConfig: ImgCropperConfig = {
    width: 1400, // Default `250`
    height: 1500, // Default `200`
    type: 'image/png', // Or you can also use `image/jpeg`
    output: {
      width: 400,
      height:500
    }
  };


   openCropperDialog(event: Event) {
    this.cropped = null!;
    this._dialog
      .open<ImagePickerDialogComponent, Event>(ImagePickerDialogComponent, {
        data: event,
        width: 320,
        disableClose: true,
      })
      .afterClosed.subscribe((result?: ImgCropperEvent) => {
        if (result) {
          this.cropped = result.dataURL;
          this._cd.markForCheck();
        }
      });
  }

  onLoaded(e:any) {
    
  }
  onCropped(e: ImgCropperEvent) {
    alert('Cropped img: ');
    console.log('Cropped img: ', e);
  }

  onReady(e: ImgCropperEvent) {
    this.ready = true;
    alert('Img ready for cropper');
    console.log('Img ready for cropper', e);
  }

  onError(e: ImgCropperErrorEvent) {
    alert(`'${e.name}' is not a valid image`);
    console.warn(`'${e.name}' is not a valid image`, e);
  }



  goBack() {
    this.location.back();
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
