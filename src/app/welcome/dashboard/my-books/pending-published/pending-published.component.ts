import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-pending-published',
  templateUrl: './pending-published.component.html',
  styleUrls: ['./pending-published.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PendingPublishedComponent{
  constructor() {}

}
