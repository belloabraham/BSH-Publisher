import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-publish-book',
  templateUrl: './publish-book.component.html',
  styleUrls: ['./publish-book.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublishBookComponent  {
  constructor() {}

}
