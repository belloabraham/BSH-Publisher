import {
  ChangeDetectionStrategy,
  OnDestroy,
  Component,
  OnInit,
  ChangeDetectorRef,
  NgZone,
} from '@angular/core';
import { Notification } from 'src/helpers/notification/notification';
import { IPublishedBook } from 'src/data/models/entities/ipublished-books';
import { Display } from 'src/helpers/utils/display';
import { SubSink } from 'subsink';
import { UnapprovedPublishedBooksViewMdel } from '../unapproved-published-books.service';
import { LyTheme2, shadowBuilder, ThemeVariables } from '@alyle/ui';
import { AlertDialog } from 'src/helpers/utils/alert-dialog';
import { Logger } from 'src/helpers/utils/logger';
import { NotificationBuilder } from 'src/helpers/notification/notification-buider';
import { removeItem } from 'src/helpers/utils/array';
import { Shield } from 'src/helpers/utils/shield';

const styles = (theme: ThemeVariables) => ({
  item: {
    padding: '0',
    background: 'white',
    boxShadow: shadowBuilder(1),
    borderRadius: '4px',
  },
});

@Component({
  selector: 'app-books-pending-approval',
  templateUrl: './books-pending-approval.component.html',
  styleUrls: ['./books-pending-approval.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksPendingApprovalComponent implements OnInit, OnDestroy {
  private subscriptions = new SubSink();
  unApprovedBooks?: IPublishedBook[];
  cardSpacing = Display.remToPixel(2);

  readonly classes = this.theme.addStyleSheet(styles);
  constructor(
    private theme: LyTheme2,
    private unapprovedBooksVM: UnapprovedPublishedBooksViewMdel,
    private _cdRef: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  async approve(book: IPublishedBook) {
    const msg = `Do you want to approve this book ${book.name}?`;
    const notification = new NotificationBuilder();

    AlertDialog.warn(msg, 'Approve Book?', 'Yes', 'No', () => {
      this.ngZone.run(async () => {
        try {

          Shield.pulse(`.id-${book.serialNo}`, "Marking book as approved...")
          await this.unapprovedBooksVM.updatePublishedBook(book.bookId, true);
          book.approved = true

          this.unApprovedBooks = removeItem(this.unApprovedBooks!, book).concat(
            []
          );
          this.unapprovedBooksVM.setAllBooks(this.unApprovedBooks);

          notification.setTimeOut(Notification.SHORT_LENGHT);
          notification
            .build()
            .success(`${book.name} was approved successfully.`);
        } catch (error) {
          Logger.error(this, this.approve.name, error);
          notification
            .build()
            .error(
              `Network error, Unable to approve ${book.name}. Try again later.`
            );
        } finally {
          Shield.remove(`.id-${book.serialNo}`);
        }
      });
    });
  }

  ngOnInit(): void {
    this.subscriptions.sink = this.unapprovedBooksVM
      .getUnApprovedPublishedBooks$()
      .subscribe((unapprovedBooks) => {
        this.unApprovedBooks = unapprovedBooks;
        this._cdRef.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
