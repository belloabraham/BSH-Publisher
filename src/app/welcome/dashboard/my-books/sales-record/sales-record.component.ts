import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserConfig } from 'gridjs';
import { Config } from 'src/data/config';
import { years } from 'src/data/oredered-record-yeas';
import { Collection } from 'src/data/remote-data-source/collection';
import { Display } from 'src/helpers/utils/display';
import { SubSink } from 'subsink';
import { SalesRecordViewModel } from './sales-record.viewmodel';

@Component({
  selector: 'app-sales-record',
  templateUrl: './sales-record.component.html',
  styleUrls: ['./sales-record.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesRecordComponent implements OnInit, OnDestroy {
  private subscriptions = new SubSink();
  years: number[] = years;

  orderedBookQueryForm!: FormGroup;
  yearFC = new FormControl(undefined, [Validators.required]);
  fromMonthFC = new FormControl(undefined, [Validators.required]);
  toMonthFC = new FormControl(undefined, [Validators.required]);

  gridConfig: UserConfig = this.getOrderedBooksTableConfig();

  constructor(private salesRecordVM: SalesRecordViewModel) {}

  ngOnInit(): void {
    this.orderedBookQueryForm = this.generateOredereBooksQuearyForm();
    this.subscriptions.sink = this.salesRecordVM
      .getSalesRecord$()
      .subscribe((orderedBooks) => {
        this.gridConfig.data = [...orderedBooks];
      });
  }

  private generateOredereBooksQuearyForm() {
    return new FormGroup({
      yearFC: this.yearFC,
      fromMonthFC: this.fromMonthFC,
      toMonthFC: this.toMonthFC,
    });
  }

  async getOrderedBooks() {
    const fromMonth = this.fromMonthFC.value;
    const toMonth = this.toMonthFC.value;
    const year = this.yearFC.value;
    await this.salesRecordVM.getSalesRecord(
      Collection.ORDERED_BOOKS,
      [],
      year,
      fromMonth,
      toMonth
    );
  }

  private getOrderedBooksTableConfig() {
    return {
      language: {
        search: {
          placeholder: 'Type any word from the record',
        },
      },
      columns: ['Book name', 'Book Id', 'Additional info'],
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
        table: {
          'font-size': Display.remToPixel(1.2),
        },
        th: {
          'font-size': Display.remToPixel(1.3),
        },
        td: {
          'font-family': Config.defaultFontFamily,
        },
      },
    };
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
