import { LyDialog } from '@alyle/ui/dialog';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
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
import { ImagePickerDialogComponent } from './image-picker-dialog/image-picker-dialog.component';
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
import { CLOUD_STORAGE_IJTOKEN } from 'src/services/storage/icloud-storage-token';
import { CloudStorageService } from 'src/services/storage/firebase/cloud-storage.service';
import { ICloudStorage } from 'src/services/storage/icloud-storage';
import { UploadTaskSnapshot } from '@angular/fire/storage';
import { IDatabase } from 'src/data/remote-data-source/idatabase';
import { DATABASE_IJTOKEN } from 'src/data/remote-data-source/database.token';
import { Collection } from 'src/data/remote-data-source/collection';
import { Logger } from 'src/helpers/utils/logger';
import { Route } from 'src/data/route';
import { Document } from 'src/data/remote-data-source/document';
import { IBookInventory } from 'src/data/models/entities/ibook-inventory';

@Component({
  selector: 'app-publish-your-book',
  templateUrl: './publish-your-book.component.html',
  styleUrls: ['./publish-your-book.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: CLOUD_STORAGE_IJTOKEN,
      useClass: CloudStorageService,
    },
  ],
})
export class PublishYourBookComponent
  implements OnInit, OnDestroy, ICanDeactivate
{
  private subscriptions = new SubSink();

  inValidBookCover = false;
  inValidCoverMsg = '';

  inValidBook = false;
  inValidBookMsg = '';
  pubId = this.userAuth.getPubId()!;

  bookUploadingMsg = '';

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
  bookTagFC = new FormControl(undefined, [Validators.required]);
  bookAuthorFC = new FormControl(undefined, [
    Validators.required,
    Validators.minLength(2),
  ]);
  bookCatgoryFC = new FormControl(undefined, [Validators.required]);
  bookNameFC = new FormControl(undefined, [Validators.required]);

  bookDetailsForm = this.getBookDetailsForm();

  private unsavedFieldsMsgTitle = '';
  private unsavedFieldsMsg = '';
  private yes = '';
  private no = '';

  private canExitRoute = new Subject<boolean>();

  isDetailsFormExpanded = true;

  private readonly MAX_ALLOWED_COVER_SIZE_IN_BYTES = 70 * 1024; //*70KB
  private readonly MAX_ALLOWED_BOOK_SIZE_IN_BYTES = 100 * 1024 * 1024; //*100Mb

  inComingRoute: string | undefined;

  croppedImage?: string;
  bookFileChosenByUser!: File;
  uploadProgress?:number 
  bookUploadErrorMsg = '';
  bookUploadErrorTitle = '';
  tryAgain = '';

  constructor(
    private _dialog: LyDialog,
    private _cd: ChangeDetectorRef,
    private title: Title,
    private localeService: LocaleService,
    private router: Router,
    private incominRouteS: IncomingRouteService,
    @Inject(USER_AUTH_IJTOKEN) private userAuth: IUserAuth,
    @Inject(CLOUD_STORAGE_IJTOKEN) private cloudStorage: ICloudStorage,
    @Inject(DATABASE_IJTOKEN) private remoteData: IDatabase
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

    this.bookUploadErrorMsg = this.localeService.translate(
      StringResKeys.bookUploadErrorMsg
    );

    this.bookUploadErrorTitle = this.localeService.translate(
      StringResKeys.bookUploadErrorTitle
    );

    this.tryAgain = this.localeService.translate(StringResKeys.tryAgain);
  }

  private get13DigitAutoGenNumb() {
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
    const autoGenIdNumb = this.get13DigitAutoGenNumb();
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

    this.cloudStorage.uploadBytesResumable(
      pathToBookFile,
      bookFileToUpload,
      this.onProgress,
      async _ => {
       await  this.uploadBookData(bookId);
      },
      this.onBookUploadError
    );
  }

  private onBookUploadError(error: any) {
    Logger.error(this, this.onBookUploadError.name, error);
    Shield.remove('.publish-book-container');
    AlertDialog.error(
      this.bookUploadErrorMsg,
      this.bookUploadErrorTitle,
      this.tryAgain,
      () => {
        this.submitFormData();
      }
    );
  }

  private navigateToMyBooks() {
    this.router.navigate([
      Route.WELCOME,
      Route.DASHBOARD,
      Route.MY_BOOKS,
    ]);
  }

  private showBookUploadSuccessMsg() {
    const msg = this.localeService.translate(
      StringResKeys.bookPublishedSuccessMsg
    );
    const title = this.localeService.translate(
      StringResKeys.bookPublishedSuccessTitle
    );
    const actionTxt = this.localeService.translate(StringResKeys.goToMyBooks);
    AlertDialog.success(msg, title, actionTxt, () => {
      this.navigateToMyBooks();
    });
  }

  private async uploadBookData(bookId: string) {
    try {
      const bookInventory = await  this.getBookSerialNo()
      const newBookData = this.getBookData(bookId, bookInventory!.total);

        this.remoteData
          .addDocData(Collection.PUBLISHED_BOOKS, [bookId], newBookData)
      this.uploadProgress = this.uploadProgress! + 10;
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
            this.uploadBookData(bookId);
          }
        );
    }

  }

  private onProgress(snapshot: UploadTaskSnapshot, progress: number) {
    this.uploadProgress = progress - 10;
  }

  private  getBookSerialNo() {
   return  this.remoteData.getDocData<IBookInventory>(Collection.INVENTORY, [Document.BOOK])
  }

  private getBookData(bookId: string, bookSerialNo:number) {
    
    let bookData: IPublishedBook = {
      approved: false,
      totalDownloads: 0,
      totalRatings: 0,
      totalReviews: 0,
      published: false,
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
      serialNo:bookSerialNo
    };

    return bookData;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
