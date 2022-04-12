import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserConfig } from 'gridjs';
import { Config } from 'src/data/config';
import { Display } from 'src/helpers/utils/display';

@Component({
  selector: 'app-sales-record',
  templateUrl: './sales-record.component.html',
  styleUrls: ['./sales-record.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesRecordComponent implements OnInit {
  years: number[] = this.initializeYears()

  orderedBookQueryForm!: FormGroup;
  yearFC = new FormControl(undefined, [Validators.required]);
  fromMonthFC = new FormControl(undefined, [Validators.required]);
  toMonthFC = new FormControl(undefined, [Validators.required]);

  public gridConfig: UserConfig = {
    language: {
      search: {
        placeholder: 'Type any word from the record',
      },
    },
    columns: ['Name', 'Email', 'Phone Number'],
    pagination: {
      enabled: true,
      limit: 50,
    },
    sort: true,
    search: true,
    data: [
      ['John', 'john@example.com', '(353) 01 222 3333'],
      ['Mark', 'mark@gmail.com', '(01) 22 888 4444'],
      ['Eoin', 'eoin@gmail.com', '0097 22 654 00033'],
      ['Sarah', 'sarahcdd@gmail.com', '+322 876 1233'],
      ['Afshin', 'afshin@mail.com', '(353) 22 87 8356'],
    ],
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

  constructor() {
    this.initializeYears()
  }

  ngOnInit(): void {
    this.orderedBookQueryForm = this.generateOredereBooksQuearyForm()
  }


  private generateOredereBooksQuearyForm() {
    return new FormGroup({
      yearFC: this.yearFC,
      fromMonthFC: this.fromMonthFC,
      toMonthFC: this.toMonthFC,
   })
}

  private initializeYears() {
    let years:number[]=[]
    let year = 2022;
    for (let index = 0; index < 100; index++) {
      year++
      years.concat(year);
    }
    return years
  }

  getOrderedBooks(){

  }
}
