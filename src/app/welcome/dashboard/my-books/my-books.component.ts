import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Route } from 'src/data/route';

@Component({
  selector: 'app-my-books',
  templateUrl: './my-books.component.html',
  styleUrls: ['./my-books.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyBooksComponent {

  salesRecord = Route.SALES_RECORD
  published = Route.PUBLISHED

  constructor() {
  }
  
}
