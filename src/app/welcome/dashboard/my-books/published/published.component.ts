import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-published',
  templateUrl: './published.component.html',
  styleUrls: ['./published.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublishedComponent{
  constructor() {}

}
