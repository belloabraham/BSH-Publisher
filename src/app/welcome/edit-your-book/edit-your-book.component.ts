import { LyDialog } from '@alyle/ui/dialog';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Config } from 'src/data/config';
import { LocaleService } from 'src/services/transloco/locale.service';
import { SubSink } from 'subsink';
import { StringResKeys } from './locale/string-res-keys';
import { IncomingRouteService } from 'src/app/shared/incoming-route.service';
import { ImgCropperEvent } from '@alyle/ui/image-cropper';
import { FileType } from 'src/data/file-type';
import { bookCategories } from 'src/data/book-categories';
import { IUserAuth } from 'src/services/authentication/iuser-auth';
import { USER_AUTH_IJTOKEN } from 'src/services/authentication/user-auth.token';
import { IPublishedBook } from 'src/data/models/entities/ipublished-books';
import { serverTimestamp } from '@angular/fire/firestore';
import { Shield } from 'src/helpers/utils/shield';
import { CloudStoragePath } from 'src/services/storage/storage-path';
import { FileUtil } from 'src/helpers/utils/file-util';
import { UploadTaskSnapshot } from '@angular/fire/storage';
import { Collection } from 'src/data/remote-data-source/collection';
import { Logger } from 'src/helpers/utils/logger';
import { PubDataViewModel } from '../pub-data.service';
import { IPublisher } from 'src/data/models/entities/ipublisher';
import { IUpdatedBook } from 'src/data/models/entities/iupdated-book';
import { PublishYourBookViewModel } from '../publish-your-book.service';
import { PublishedBookViewModel } from '../dashboard/published-book.service';
import { ImagePickerDialogComponent } from 'src/app/shared/image-picker-dialog/image-picker-dialog.component';
import { NotificationBuilder } from 'src/helpers/notification/notification-buider';
import { escapeJSONNewlineChars } from 'src/helpers/utils/string-util';
import { RouteParams } from 'src/data/RouteParams';

@Component({
  selector: 'app-edit-your-book',
  templateUrl: './edit-your-book.component.html',
  styleUrls: ['./edit-your-book.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditYourBookComponent implements OnInit, OnDestroy {
  private subscriptions = new SubSink();

  isInValidBookCover = false;
  inValidCoverMsg = '';

  isInValidBook = false;
  inValidBookMsg = '';

  private pubId = this.userAuth.getPubId()!;

  bookCategories = bookCategories;

  bookCoverFC = new UntypedFormControl(undefined, [Validators.required]);
  bookDocumentFC = new UntypedFormControl(undefined, [Validators.required]);

  bookPriceFC = new UntypedFormControl(undefined, [Validators.required]);
  bookDescFC = new UntypedFormControl(undefined, [Validators.required]);
  bookAuthorFC = new UntypedFormControl(undefined, [
    Validators.required,
    Validators.minLength(2),
  ]);
  bookCatgoryFC = new UntypedFormControl(undefined, [Validators.required]);
  bookNameFC = new UntypedFormControl(undefined, [Validators.required]);

  bookDetailsForm!: UntypedFormGroup;
  bookDocumentForm!: UntypedFormGroup;
  bookCoverForm!: UntypedFormGroup;

  private readonly MAX_ALLOWED_COVER_SIZE_IN_BYTES = 100 * 1024; //*100KB
  private readonly MAX_ALLOWED_BOOK_SIZE_IN_BYTES = 100 * 1024 * 1024; //*100Mb

  croppedImage?: string;
  bookFileChosenByUser!: File;
  bookDocUploadProgress = 0;
  private notification = new NotificationBuilder().build();

  sellerCurrency = 'NGN';

  pubData!: IPublisher;
  existingBookData?: IPublishedBook;
  private readonly bookId: string =
    this.activatedRoute.snapshot.params[RouteParams.BOOK_ID];

  constructor(
    private _dialog: LyDialog,
    private _cd: ChangeDetectorRef,
    private title: Title,
    private localeService: LocaleService,
    private router: Router,
    private incominRouteS: IncomingRouteService,
    @Inject(USER_AUTH_IJTOKEN) private userAuth: IUserAuth,
    private publishYouBookVM: PublishYourBookViewModel,
    private pubDataVM: PubDataViewModel,
    private activatedRoute: ActivatedRoute,
    private publishedBookVM: PublishedBookViewModel
  ) {
    this.notification.isClickToClose = true;
  }

  private getBookDetailsForm() {
    return new UntypedFormGroup({
      bookPriceFC: this.bookPriceFC,
      bookDescFC: this.bookDescFC,
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
          this.isInValidBook = true;
        } else {
          this.isInValidBook = false;
          this.bookFileChosenByUser = file;
        }
      } else {
        this.inValidBookMsg = this.localeService.translate(
          StringResKeys.invalidBookType
        );
        this.isInValidBook = true;
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
          this.isInValidBookCover = false;
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
    this.isInValidBookCover = true;
  }

  private setInvalidCoverImageTypeMsg() {
    this.inValidCoverMsg = this.localeService.translate(
      StringResKeys.invalidImgType
    );
    this.isInValidBookCover = true;
  }

  goBack() {
    this.router.navigateByUrl(this.incominRouteS.route);
  }

  ngOnInit(): void {
    this.bookDetailsForm = this.getBookDetailsForm();
    this.bookDocumentForm = this.getBookDocumentForm();
    this.bookCoverForm = this.getBookCoverForm();

    this.getStrinRes();
    this.subscriptions.sink = this.pubDataVM
      .getPublisher$()
      .subscribe((pubData) => {
        this.pubData = pubData;
        this.sellerCurrency = pubData.sellingCurrency;
      });

    this.loadExistingBookData(this.bookId);
  }

  private loadExistingBookData(bookId: string) {
    let book = this.publishedBookVM.getPublishedBookById(bookId)!;
    this.bookAuthorFC.patchValue(book.author);
    this.bookCatgoryFC.patchValue(book.category);
    this.bookDescFC.patchValue(book.description);
    this.bookPriceFC.patchValue(book.price);
    this.bookNameFC.patchValue(book.name);

    this._cd.detectChanges();
  }

  private getStrinRes() {
    this.subscriptions.sink = this.localeService
      .getIsLangLoadSuccessfullyObs()
      .subscribe((_) => {
        this.setTitle();
      });
  }

  private setTitle() {
    this.title.setTitle(
      this.localeService.paramTranslate(StringResKeys.title, {
        value: Config.APP_NAME,
      })
    );
  }

  private getBookDocumentForm() {
    return new UntypedFormGroup({
      bookDocumentFC: this.bookDocumentFC,
    });
  }

  private getBookCoverForm() {
    return new UntypedFormGroup({
      bookCoverFC: this.bookCoverFC,
    });
  }

  async uploadBookDocForm() {
    const bookUploadingMsg = this.localeService.translate(
      StringResKeys.bookUpdatingMsg
    );

    Shield.pulse('.form-book', bookUploadingMsg);
    let bookFileName = '';

    if (this.bookId.includes(this.pubId)) {
      bookFileName = this.bookId.split('-')[1];
    } else {
      bookFileName = this.bookId;
    }

    bookFileName = `${bookFileName}.pdf`;
    const bookFileToUpload = FileUtil.rename(
      this.bookFileChosenByUser,
      bookFileName
    );

    const pathToBookFile = `${CloudStoragePath.publishedBooks}/${this.pubId}/${this.bookId}/${bookFileName}`;

    this.publishYouBookVM.uploadBookFile(
      pathToBookFile,
      bookFileToUpload,
      (snapshot: UploadTaskSnapshot, progress: number) => {
        this.bookDocUploadProgress = Math.floor(progress);
        this._cd.detectChanges();
      },
      (_) => {
        Shield.remove('.form-book');
        const successMsg = this.localeService.translate(
          StringResKeys.updatedSucess
        );

        this.notification.success(successMsg);
      },
      (error: any) => {
        Logger.error(this, this.uploadBookDocForm.name, error);
        Shield.remove('.form-book');
        const errorMsg = this.localeService.translate(
          StringResKeys.updatedSucess
        );
        this.notification.error(errorMsg);
      }
    );
  }

  async uploadBookDataForm() {
    const msg = this.localeService.translate(StringResKeys.updatingBookDetails);
    Shield.pulse('.form-book-details',  msg);
    try {
      await this.publishYouBookVM.updateBookData(
        Collection.PUBLISHED_BOOKS,
        [this.bookId],
        this.getUpdatedBookData()
      );

      Shield.remove('.form-book-details');

      const successMsg = this.localeService.translate(
        StringResKeys.updatedSucess
      );

      this.notification.success(successMsg);
    } catch (error) {
      Logger.error(this, this.uploadBookDataForm.name, error);
      Shield.remove('.form-book-details');
      const errorMsg = this.localeService.translate(StringResKeys.updateError);
      this.notification.error(errorMsg);
    }
  }

  async uploadBookCover() {
    const msg = this.localeService.translate(StringResKeys.updatingBookCover);
    Shield.pulse('.form-book-cover', msg);
    try {
      await this.publishYouBookVM.updateBookCover(
        Collection.PUBLISHED_BOOKS,
        [this.bookId],
        {
          coverDataUrl: this.croppedImage!,
          approved: false,
        }
      );

      Shield.remove('.form-book-cover');
      const successMsg = this.localeService.translate(
        StringResKeys.updatedSucess
      );

      this.notification.success(successMsg);
    } catch (error) {
      Logger.error(this, this.uploadBookCover.name, error);
      Shield.remove('.form-book-cover');
      const errorMsg = this.localeService.translate(StringResKeys.updateError);

      this.notification.error(errorMsg);
    }
  }

  private getUpdatedBookData(): IUpdatedBook {
    return {
      name: escapeJSONNewlineChars(this.bookNameFC.value),
      author: escapeJSONNewlineChars(this.bookAuthorFC.value),
      lastUpdated: serverTimestamp(),
      description: escapeJSONNewlineChars(this.bookDescFC.value),
      category: this.bookCatgoryFC.value,
      price: this.bookPriceFC.value,
      approved: false,
    };
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
