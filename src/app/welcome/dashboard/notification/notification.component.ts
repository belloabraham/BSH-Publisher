import { XPosition } from '@alyle/ui';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { INotification } from 'src/domain/models/entities/inotifications';
import { SubSink } from 'subsink';
import { NotificationsViewModel } from './notifications.viewmodel';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent implements OnInit, OnDestroy {
  left = XPosition.left;

  private subscriptions = new SubSink();

   notifications?: INotification[] | null 

  constructor(private notificationVM: NotificationsViewModel) {
  }

  ngOnInit(): void {
    this.notificationVM.getAllNotifications()
      .subscribe(notifications => {
        this.notifications = notifications
      }
    )
  }

  getNotificationDate() {
    
  }

  deleteAllNotification() {
    
  }

  deleteNotification(notifID?:string) {
    
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
