import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Grid, UserConfig } from 'gridjs';
import { Config } from 'src/data/config';
import { years } from 'src/data/oredered-record-yeas';
import { Display } from 'src/helpers/utils/display';

@Component({
  selector: 'app-sales-record',
  templateUrl: './sales-record.component.html',
  styleUrls: ['./sales-record.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesRecordComponent implements OnInit {
  years: number[] = years;

  orderedBookQueryForm!: FormGroup;
  yearFC = new FormControl(undefined, [Validators.required]);
  fromMonthFC = new FormControl(undefined, [Validators.required]);
  toMonthFC = new FormControl(undefined, [Validators.required]);

  gridConfig: UserConfig = this.getOrderedBooksTableConfig();

  constructor() {}

  ngOnInit(): void {
    this.orderedBookQueryForm = this.generateOredereBooksQuearyForm();
  }

  private generateOredereBooksQuearyForm() {
    return new FormGroup({
      yearFC: this.yearFC,
      fromMonthFC: this.fromMonthFC,
      toMonthFC: this.toMonthFC,
    });
  }

  getOrderedBooks() {}

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
}
