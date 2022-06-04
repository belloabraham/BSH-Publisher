import { LyDialog } from '@alyle/ui/dialog';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Config } from 'src/data/config';
import { LocaleService } from 'src/services/transloco/locale.service';
import { AlertDialog } from 'src/helpers/utils/alert-dialog';
import { SubSink } from 'subsink';
import { StringResKeys } from './locale/string-res-keys';
import { ICanDeactivate } from 'src/app/shared/i-can-deactivate';
import { IncomingRouteService } from 'src/app/shared/incoming-route.service';
import { Regex } from 'src/data/regex';
import { ImgCropperEvent } from '@alyle/ui/image-cropper';
import { FileType } from 'src/data/file-type';
import { currencies } from 'src/data/currencies';
import { bookTags } from 'src/data/book-tag';
import { bookCategories } from 'src/data/book-categories';
import { IUserAuth } from 'src/services/authentication/iuser-auth';
import { USER_AUTH_IJTOKEN } from 'src/services/authentication/user-auth.token';
import { IPublishedBook } from 'src/data/models/entities/ipublished-books';
import { serverTimestamp } from '@angular/fire/firestore';
import { Shield } from 'src/helpers/utils/shield';
import { Display } from 'src/helpers/utils/display';
import { CloudStoragePath } from 'src/services/storage/storage-path';
import { FileUtil } from 'src/helpers/utils/file-util';
import { UploadTaskSnapshot } from '@angular/fire/storage';
import { Collection } from 'src/data/remote-data-source/collection';
import { Logger } from 'src/helpers/utils/logger';
import { Route } from 'src/data/route';
import { Document } from 'src/data/remote-data-source/document';
import { PublishYourBookViewModel } from '../publish-your-book.viewmodel';
import { PubDataViewModel } from '../pub-data.viewmodels';
import { IPublisher } from 'src/data/models/entities/ipublisher';
import { PublishedBookViewModel } from '../dashboard/published-book.viewmodel';
import { ImagePickerDialogComponent } from '../../shared/image-picker-dialog/image-picker-dialog.component';

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
  isPublishedBookSucess = false;

  inValidBook = false;
  inValidBookMsg = '';
  private pubId = this.userAuth.getPubId()!;

  bookCategories = bookCategories;
  bookTags = bookTags;
  bookSalesCurrencies = currencies;

  bookPublishForm!: FormGroup;
  bookCoverFC = new FormControl(undefined, [Validators.required]);
  bookDocumentFC = new FormControl(undefined, [Validators.required]);

  bookPriceFC = new FormControl(undefined, [Validators.required]);
  bookISBNFC = new FormControl(undefined, [Validators.pattern(Regex.ISBN)]);
  bookDescFC = new FormControl(undefined, [Validators.required]);
  bookSaleCurrencyFC = new FormControl(undefined, [Validators.required]);
  bookTagFC = new FormControl(undefined);
  bookAuthorFC = new FormControl(undefined, [
    Validators.required,
    Validators.minLength(2),
  ]);
  bookCatgoryFC = new FormControl(undefined, [Validators.required]);
  bookNameFC = new FormControl(undefined, [Validators.required]);

  bookDetailsForm = this.getBookDetailsForm();

  private canExitRoute = new Subject<boolean>();

  isDetailsFormExpanded = true;

  private readonly MAX_ALLOWED_COVER_SIZE_IN_BYTES = 70 * 1024; //*70KB
  private readonly MAX_ALLOWED_BOOK_SIZE_IN_BYTES = 100 * 1024 * 1024; //*100Mb

  croppedImage?: string;
  bookFileChosenByUser!: File;
  uploadProgress = 0;
  private bookUploadErrorMsg = '';
  private bookUploadErrorTitle = '';
  private tryAgain = '';

  sellerCurrency?: string;
  pubData!: IPublisher;

  constructor(
    private _dialog: LyDialog,
    private _cd: ChangeDetectorRef,
    private title: Title,
    private localeService: LocaleService,
    private router: Router,
    private ngZone:NgZone,
    private incominRouteS: IncomingRouteService,
    @Inject(USER_AUTH_IJTOKEN) private userAuth: IUserAuth,
    private publishYouBookVM: PublishYourBookViewModel,
    private pubDataVM: PubDataViewModel,
    private publishedBookVM: PublishedBookViewModel
  ) {}

  private getBookDetailsForm() {
    return new FormGroup({
      bookPriceFC: this.bookPriceFC,
      bookISBNFC: this.bookISBNFC,
      bookDescFC: this.bookDescFC,
      bookSaleCurrencyFC: this.bookSaleCurrencyFC,
      bookTagFC: this.bookTagFC,
      bookAuthorFC: this.bookAuthorFC,
      bookCatgoryFC: this.bookCatgoryFC,
      bookNameFC: this.bookNameFC,
    });
  }

  chooseACoverImage(e: any) {
    this.bookCoverFC.markAsTouched();
    e.click();
  }

  onBookFileUpload(e: any) {
    if (e.target.files && e.target.files[0]) {
      const file: File = e.target.files[0];
      if (file.type === FileType.PDF) {
        if (file.size > this.MAX_ALLOWED_BOOK_SIZE_IN_BYTES) {
          this.inValidBookMsg = this.localeService.paramTranslate(
            StringResKeys.bookTooLargeMsg,
            {
              value: `${this.MAX_ALLOWED_BOOK_SIZE_IN_BYTES / (1024 * 1024)}Mb`,
            }
          );
          this.inValidBook = true;
        } else {
          this.inValidBook = false;
          this.bookFileChosenByUser = file;
        }
      } else {
        this.inValidBookMsg = this.localeService.translate(
          StringResKeys.invalidBookType
        );
        this.inValidBook = true;
      }
    }
  }

  openCropperDialog(event: Event) {
    this.croppedImage = null!;
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
        if (
          result.type! !== FileType.PNG ||
          result.size > this.MAX_ALLOWED_COVER_SIZE_IN_BYTES
        ) {
          this.setInvalidCoverSizeMsg();

          if (result.type !== FileType.PNG) {
            this.setInvalidCoverImageTypeMsg();
          }
        } else {
          this.croppedImage = result.dataURL;
          this.inValidBookCover = false;
        }
      } else {
        this.setInvalidCoverImageTypeMsg();
      }
    } catch (error) {
      this.setInvalidCoverImageTypeMsg();
    }
  }

  private setInvalidCoverSizeMsg() {
    this.inValidCoverMsg = this.localeService.paramTranslate(
      StringResKeys.imgTooLargeMsg,
      { value: `${this.MAX_ALLOWED_COVER_SIZE_IN_BYTES / 1024}kb` }
    );
    this.inValidBookCover = true;
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
    this.bookPublishForm = this.generateBookPublishForm();
    this.getStrinRes();
    this.subscriptions.sink = this.pubDataVM
      .getPublisher$()
      .subscribe((pubData) => {
        this.pubData = pubData;
        this.sellerCurrency = pubData.sellerCurrency;
        if (this.sellerCurrency) {
          this.bookSaleCurrencyFC.patchValue(this.sellerCurrency);
        }
      });
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
    if (this.bookPublishForm.dirty && !this.isPublishedBookSucess) {
      const no = this.localeService.translate(StringResKeys.no);
      const yes = this.localeService.translate(StringResKeys.yes);
      const unsavedFieldsMsg = this.localeService.translate(
        StringResKeys.unsavedFieldsMsg
      );
      const unsavedFieldsMsgTitle = this.localeService.translate(
        StringResKeys.unsavedFieldsMsgTitle
      );
      AlertDialog.warn(
        unsavedFieldsMsg,
        unsavedFieldsMsgTitle,
        yes,
        no,
        () => this.ngZone.run(()=> this.canExitRoute.next(true)),
        () => this.ngZone.run(()=> this.canExitRoute.next(false))
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
    this.bookUploadErrorMsg = this.localeService.translate(
      StringResKeys.bookUploadErrorMsg
    );

    this.bookUploadErrorTitle = this.localeService.translate(
      StringResKeys.bookUploadErrorTitle
    );

    this.tryAgain = this.localeService.translate(StringResKeys.tryAgain);
  }

  private generate13DigitNumb() {
    const bookId = `${Math.floor(
      1000000000000 + Math.random() * 9000000000000
    )}`;
    return bookId;
  }

  submitFormData() {
    const bookUploadingMsg = this.localeService.translate(
      StringResKeys.bookUploadingMsg
    );
    Shield.pulse(
      '.publish-book-container',
      Display.remToPixel(1.5),
      bookUploadingMsg
    );
    let bookId = '';
    const autoGenIdNumb = this.generate13DigitNumb();
    let bookFileName = '';

    if (this.bookISBNFC.value) {
      bookId = this.bookISBNFC.value;
      bookFileName = bookId;
    } else {
      bookId = `${this.pubId}-${autoGenIdNumb}`;
      bookFileName = autoGenIdNumb;
    }
    bookFileName = `${bookFileName}.pdf`;
    const bookFileToUpload = FileUtil.rename(
      this.bookFileChosenByUser,
      bookFileName
    );

    const pathToBookFile = `${CloudStoragePath.publishedBooks}/${this.pubId}/${bookId}/${bookFileName}`;

    this.publishYouBookVM.uploadBookFile(
      pathToBookFile,
      bookFileToUpload,
      (snapshot: UploadTaskSnapshot, progress: number) => {
        this.uploadProgress = Math.floor(
          progress > 10 ? progress - 10 : progress
        );
        this._cd.detectChanges();
      },
      async (_) => {
        await this.uploadBookData(bookId);
      },
      (error) => {
        Logger.error(this, 'onBookUploadError', error);
        Shield.remove('.publish-book-container');
        this.isPublishedBookSucess = false;
        console.log(error.message);
        AlertDialog.error(
          this.bookUploadErrorMsg,
          this.bookUploadErrorTitle,
          this.tryAgain,
          () => {
            this.ngZone.run(()=>this.submitFormData());
          }
        );
      }
    );
  }

  private navigateToMyBooks() {
    this.router.navigate([Route.WELCOME, Route.DASHBOARD, Route.MY_BOOKS]);
  }

  private showBookUploadSuccessMsg() {
    const msg = this.localeService.translate(
      StringResKeys.bookPublishedSuccessMsg
    );
    const title = this.localeService.translate(
      StringResKeys.bookPublishedSuccessTitle
    );
    this.isPublishedBookSucess = true;
    const actionTxt = this.localeService.translate(StringResKeys.goToMyBooks);
    AlertDialog.success(msg, title, actionTxt, () => {
      this.ngZone.run(()=> this.navigateToMyBooks())
    });
  }

  private async uploadBookData(bookId: string) {
    try {
      const newBookData = this.getBookData(bookId);

      if (this.sellerCurrency === undefined || this.sellerCurrency === null) {
        this.pubData.sellerCurrency = newBookData.sellerCurrency;
        await this.pubDataVM.updatePublisher(
          { pubData: this.pubData },
          this.pubId
        );
      }

      const sNDocRef = this.publishYouBookVM.getDocRef(Collection.INVENTORY, [
        Document.BOOK,
      ]);
      const bookUploadDocRef = this.publishYouBookVM.getDocRef(
        Collection.PUBLISHED_BOOKS,
        [bookId]
      );

        await this.publishYouBookVM.uploadBookDataTransaction(
          sNDocRef,
          bookUploadDocRef,
          newBookData
        );
      

      this.uploadProgress = this.uploadProgress + 10;
      this._cd.detectChanges();
      Shield.remove('.publish-book-container');

      this.showBookUploadSuccessMsg();
    } catch (error) {
      Logger.error(this, this.uploadBookData.name, error);
      Shield.remove('.publish-book-container');
      AlertDialog.error(
        this.bookUploadErrorMsg,
        this.bookUploadErrorTitle,
        this.tryAgain,
        () => {
          this.ngZone.run(() => this.uploadBookData(bookId));
        }
      );
    }
  }

  private getBookData(bookId: string): IPublishedBook {
    return {
      approved: false,
      totalDownloads: 0,
      totalRatings: 0,
      totalReviews: 0,
      published: true,
      publishedDate: serverTimestamp(),
      bookId: bookId,
      name: this.bookNameFC.value,
      author: this.bookAuthorFC.value,
      coverUrl: this.croppedImage!,
      lastUpdated: serverTimestamp(),
      description: this.bookDescFC.value,
      category: this.bookCatgoryFC.value,
      tag: this.bookTagFC.value,
      sellerCurrency: this.bookSaleCurrencyFC.value,
      recommended: false,
      price: this.bookPriceFC.value,
      pubId: this.pubId,
    };
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
