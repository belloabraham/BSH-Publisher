import { XPosition } from '@alyle/ui';
import { ChangeDetectionStrategy, Component } from '@angular/core';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent {
  left = XPosition.left;
  constructor() {}
}
