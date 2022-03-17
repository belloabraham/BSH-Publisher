import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-book-details-form',
  templateUrl: './book-details-form.component.html',
  styleUrls: ['./book-details-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookDetailsFormComponent {
  constructor() {}
}
