import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Route } from 'src/data/route';
import { SalesRecordViewModel } from './sales-record/sales-record.viewmodel';

@Component({
  selector: 'app-my-books',
  templateUrl: './my-books.component.html',
  styleUrls: ['./my-books.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers:[SalesRecordViewModel]
})
export class MyBooksComponent {

  salesRecord = Route.SALES_RECORD

  constructor() {
  
  }
}
