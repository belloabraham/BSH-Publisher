import { ChangeDetectorRef, Component } from '@angular/core';
import { Route } from 'src/data/route';

@Component({
  selector: 'app-my-books',
  templateUrl: './my-books.component.html',
  styleUrls: ['./my-books.component.scss'],
})
export class MyBooksComponent {

  unpublished = Route.unpublished
  pending=Route.pendingApproval

  constructor(cdRef: ChangeDetectorRef) {
    cdRef.detach
  }
}
