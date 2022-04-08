import { XPosition, YPosition } from '@alyle/ui';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { IPublishedBook } from 'src/data/models/entities/ipublished-books';
import { DateUtil } from 'src/helpers/utils/date-util';
import { LocaleService } from 'src/services/transloco/locale.service';
import { SubSink } from 'subsink';
import { AllBooksViewModel } from '../all-books.viewmodel';
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
    private allBookVM: AllBooksViewModel,
    private localeService: LocaleService
  ) {}

  ngOnInit(): void {
    this.subscriptions.sink = this.allBookVM
      .getAllBooks$()
      .subscribe((allBooks) => {
        this.books = allBooks;
      });
  }


  edit(bookId:string) {
    
  }

  unpublish(bookId:string){
    
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
