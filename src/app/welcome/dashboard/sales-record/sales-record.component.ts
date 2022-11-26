import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { UserConfig } from 'gridjs';
import { Config } from 'src/data/config';
import { IPublishedBook } from 'src/data/models/entities/ipublished-books';
import { years } from 'src/data/oredered-record-yeas';
import { Collection } from 'src/data/remote-data-source/collection';
import { getBookId } from 'src/helpers/get-book-id';
import { Shield } from 'src/helpers/utils/shield';
import { SubSink } from 'subsink';
import { PublishedBookViewModel } from '../published-book.service';
import { SalesRecordViewModel } from './sales-record.service';

@Component({
  selector: 'app-sales-record',
  templateUrl: './sales-record.component.html',
  styleUrls: ['./sales-record.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesRecordComponent implements OnInit, OnDestroy {
  private subscriptions = new SubSink();
  years: number[] = years;

  books!: IPublishedBook[];

  orderedBookQueryForm!: UntypedFormGroup;
  yearFC = new UntypedFormControl(undefined, [Validators.required]);
  bookFC = new UntypedFormControl(undefined, [Validators.required]);
  fromMonthFC = new UntypedFormControl(undefined, [Validators.required]);
  toMonthFC = new UntypedFormControl(undefined, [Validators.required]);

  data: string[][] = [];

  gridConfig: UserConfig = this.getOrderedBooksTableConfig();
  getBookId = getBookId;

  constructor(
    private salesRecordVM: SalesRecordViewModel,
    private cdRef: ChangeDetectorRef,
    private publishedBookVM: PublishedBookViewModel
  ) {}

  ngOnInit(): void {
    this.orderedBookQueryForm = this.generateOredereBooksQuearyForm();
    this.books = this.publishedBookVM.getAllBooks();
    this.subscriptions.sink = this.salesRecordVM
      .getSalesRecord$()
      .subscribe((orderedBooks) => {
        this.data = orderedBooks;
        Shield.remove('.sales-record');
        this.cdRef.detectChanges();
      });
  }

  private generateOredereBooksQuearyForm() {
    return new UntypedFormGroup({
      yearFC: this.yearFC,
      bookFC: this.bookFC,
      fromMonthFC: this.fromMonthFC,
      toMonthFC: this.toMonthFC,
    });
  }

  async getOrderedBooks() {
    Shield.standard('.sales-record');
    const fromMonth = this.fromMonthFC.value;
    const toMonth = this.toMonthFC.value;
    const year = this.yearFC.value;
    const bookId = this.bookFC.value;
    try {
      await this.salesRecordVM.getSalesRecord(
        Collection.ORDERED_BOOKS,
        bookId,
        year,
        fromMonth,
        toMonth
      );
    } catch (error) {
      Shield.remove('.sales-record');
    }
  }

  private getOrderedBooksTableConfig() {
    return {
      language: {
        search: {
          placeholder: 'Type to search records',
        },
      },
      columns: ['Book Name', 'Book ID/ISBN', 'Additional Info'],
      pagination: {
        enabled: true,
        limit: 50,
      },
      sort: true,
      search: true,
      className: {
        table: 'table table-striped table-hover table-bordered',
        th: 'text-dark',
      },
      style: {
        td: {
          'font-family': Config.defaultFontFamily,
        },
        th: {
          'font-family': Config.defaultFontFamily,
        },
      },
    };
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
