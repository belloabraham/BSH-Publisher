import { YPosition } from '@alyle/ui';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { IPublishedBook } from 'src/data/models/entities/ipublished-books';
import { Collection } from 'src/data/remote-data-source/collection';
import { Fields } from 'src/data/remote-data-source/fields';
import { NotificationBuilder } from 'src/helpers/notification/notification-buider';
import { DateUtil } from 'src/helpers/utils/date-util';
import { Logger } from 'src/helpers/utils/logger';
import { IUserAuth } from 'src/services/authentication/iuser-auth';
import { USER_AUTH_IJTOKEN } from 'src/services/authentication/user-auth.token';
import { LocaleService } from 'src/services/transloco/locale.service';
import { SubSink } from 'subsink';
import { PublishedBookViewModel } from '../../published-book.viewmodel';
import { StringResKeys } from './locale/string-res-keys';

@Component({
  selector: 'app-published',
  templateUrl: './published.component.html',
  styleUrls: ['./published.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublishedComponent implements OnInit, OnDestroy {
  private subscriptions = new SubSink();
  books?: IPublishedBook[];

  bottom = YPosition.below;

  constructor(
    private publishedBookVM: PublishedBookViewModel,
    private localeService: LocaleService,
  ) {}

  ngOnInit(): void {
    this.subscriptions.sink = this.publishedBookVM
      .getAllBooks$()
      .subscribe((allBooks) => {
        this.books = allBooks;
      });
  }

  edit(bookId: string) {}

  async unpublish(bookId: string) {
    const notification = new NotificationBuilder()
      .build();
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
      notification.success(successMsg);
    } catch (error) {
      Logger.error(this, this.unpublish.name, error);
      const errorsMsg = this.localeService.translate(
        StringResKeys.updateErrorMsg
      );
      notification.error(errorsMsg);
    }
  }

  getDateTime(timeStamp: Timestamp) {
    return DateUtil.getHumanReadbleDateTime(
      DateUtil.getLocalDateTime(timeStamp)
    );
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

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
