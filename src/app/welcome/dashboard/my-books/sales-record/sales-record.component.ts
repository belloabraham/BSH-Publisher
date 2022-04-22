import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserConfig } from 'gridjs';
import { TData } from 'gridjs/dist/src/types';
import { Config } from 'src/data/config';
import { years } from 'src/data/oredered-record-yeas';
import { Collection } from 'src/data/remote-data-source/collection';
import { Display } from 'src/helpers/utils/display';
import { Shield } from 'src/helpers/utils/shield';
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

  data: string[][] = [];

  gridConfig: UserConfig = this.getOrderedBooksTableConfig();

  constructor(
    private salesRecordVM: SalesRecordViewModel,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.orderedBookQueryForm = this.generateOredereBooksQuearyForm();
    this.subscriptions.sink = this.salesRecordVM
      .getSalesRecord$()
      .subscribe((orderedBooks) => {
        this.data = orderedBooks;
        Shield.remove('.sales-record');
        this.cdRef.detectChanges();
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
    Shield.standard('.sales-record');
    const fromMonth = this.fromMonthFC.value;
    const toMonth = this.toMonthFC.value;
    const year = this.yearFC.value;
    try {
      await this.salesRecordVM.getSalesRecord(
        Collection.ORDERED_BOOKS,
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
