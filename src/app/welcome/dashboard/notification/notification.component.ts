import { XPosition } from '@alyle/ui';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { INotification } from 'src/domain/models/entities/inotifications';
import { NotificationsViewModel } from './notifications.viewmodel';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent {
  left = XPosition.left;

  notifications$!: ReplaySubject<INotification[] | null>;

  constructor(notificationVM: NotificationsViewModel) {
     this.notifications$ = notificationVM.getAllNotifications()
  }
}
