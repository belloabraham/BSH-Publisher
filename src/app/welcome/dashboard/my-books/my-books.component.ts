import { ChangeDetectorRef, Component } from '@angular/core';

@Component({
  selector: 'app-my-books',
  templateUrl: './my-books.component.html',
  styleUrls: ['./my-books.component.scss'],
})
export class MyBooksComponent {
  constructor(cdRef: ChangeDetectorRef) {
    cdRef.detach
  }
}
