import { ChangeDetectorRef, Component } from '@angular/core';

@Component({
  selector: 'app-book-store',
  templateUrl: './book-store.component.html',
  styleUrls: ['./book-store.component.scss'],
})
export class BookStoreComponent {
  constructor(cdRef: ChangeDetectorRef) {
    cdRef.detach;
  }
}
