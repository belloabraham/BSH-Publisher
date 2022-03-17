import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-book-asset-form',
  templateUrl: './book-asset-form.component.html',
  styleUrls: ['./book-asset-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookAssetFormComponent {
  constructor() {}
}
