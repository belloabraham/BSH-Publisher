import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Route } from 'src/domain/data/route';

@Component({
  selector: 'app-my-books',
  templateUrl: './my-books.component.html',
  styleUrls: ['./my-books.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class MyBooksComponent {

  unpublished = Route.UNPUBLISHED
  pending = Route.PENDING_APPROVAL

  constructor() {
  
  }
}
