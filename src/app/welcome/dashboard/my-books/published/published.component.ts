import { LyTheme2, shadowBuilder, ThemeVariables, YPosition } from '@alyle/ui';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { IPublishedBook } from 'src/data/models/entities/ipublished-books';
import { Collection } from 'src/data/remote-data-source/collection';
import { Fields } from 'src/data/remote-data-source/fields';
import { Route } from 'src/data/route';
import { getBookId } from 'src/helpers/get-book-id';
import { Notification } from 'src/helpers/notification/notification';
import { NotificationBuilder } from 'src/helpers/notification/notification-buider';
import { DateUtil } from 'src/helpers/utils/date-util';
import { Logger } from 'src/helpers/utils/logger';
import { Shield } from 'src/helpers/utils/shield';
import { LocaleService } from 'src/services/transloco/locale.service';
import { SubSink } from 'subsink';
import { PublishedBookViewModel } from '../../published-book.service';
import { StringResKeys } from './locale/string-res-keys';

const styles = (theme: ThemeVariables) => ({
  shadow: {
    boxShadow: shadowBuilder(1),
  },
});

@Component({
  selector: 'app-published',
  templateUrl: './published.component.html',
  styleUrls: ['./published.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublishedComponent implements OnInit, OnDestroy {
  private subscriptions = new SubSink();
  books?: IPublishedBook[];
  getBookId = getBookId;

  bottom = YPosition.below;

  readonly classes = this.theme.addStyleSheet(styles);

  constructor(
    private theme: LyTheme2,
    private publishedBookVM: PublishedBookViewModel,
    private localeService: LocaleService,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscriptions.sink = this.publishedBookVM
      .getAllBooks$()
      .subscribe((allBooks) => {
        this.books = allBooks;
        this.cdRef.detectChanges();
      });
  }

  edit(bookId: string) {
    this.router.navigate([
      Route.ROOT,
      Route.WELCOME,
      Route.EDIT_YOUR_BOOK,
      bookId,
    ]);
  }

  getBookRating(book: IPublishedBook) {
    return book.totalRatings === 0 || book.totalReviews === 0
      ? 0
      : book.totalRatings / book.totalReviews;
  }

  async unpublish(bookId: string) {
    const notification = new NotificationBuilder()
      .setTimeOut(Notification.SHORT_LENGHT)
      .setIsClickToClose(true)
      .build();
    Shield.standard('.my-books', 'Updating book');
    try {
      await this.publishedBookVM.unPublishBook(
        Collection.PUBLISHED_BOOKS,
        [bookId],
        Fields.published,
        false
      );
      const successMsg = this.localeService.translate(
        StringResKeys.updateSuccessMsg
      );
      this.publishedBookVM.setPublishedStatus(false, bookId);
      Shield.remove('.my-books');
      notification.success(successMsg);
    } catch (error) {
      Logger.error(this, this.unpublish.name, error);
      const errorsMsg = this.localeService.translate(
        StringResKeys.updateErrorMsg
      );
      Shield.remove('.my-books');
      notification.error(errorsMsg);
    }
  }

  getDateTime(timeStamp: Timestamp) {
    return DateUtil.getHumanReadbleDateTime(
      DateUtil.getLocalDateTime(timeStamp)
    );
  }

  async publish(bookId: string) {
    const notification = new NotificationBuilder()
      .setTimeOut(Notification.SHORT_LENGHT)
      .setIsClickToClose(true)
      .build();
    Shield.standard('.my-books', 'Updating book');
    try {
      await this.publishedBookVM.unPublishBook(
        Collection.PUBLISHED_BOOKS,
        [bookId],
        Fields.published,
        true
      );
      this.publishedBookVM.setPublishedStatus(true, bookId);
      Shield.remove('.my-books');
      notification.success('Book successfully published to book store');
    } catch (error) {
      Logger.error(this, this.publish.name, error);
      Shield.remove('.my-books');
      notification.error('Network error, failed to published book.');
    }
  }

  getBookStatus(book: IPublishedBook) {
    if (book.approved === false) {
      return this.localeService.translate(StringResKeys.pendingApproval);
    } else if (book.published === false) {
      return this.localeService.translate(StringResKeys.unPublished);
    } else {
      return this.localeService.translate(StringResKeys.published);
    }
  }

  getBookStatusColor(book: IPublishedBook) {
    if (book.approved === false) {
      return '#ffc107';
    } else if (book.published === false) {
      return '#f20000';
    } else {
      return '#00cc33';
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
