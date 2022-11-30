import { XPosition } from '@alyle/ui';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Timestamp } from 'firebase/firestore';
import { Collection } from 'src/data/remote-data-source/collection';
import { INotification } from 'src/data/models/entities/inotifications';
import { LocaleService } from 'src/services/transloco/locale.service';
import { DateUtil } from 'src/helpers/utils/date-util';
import { IUserAuth } from 'src/services/authentication/iuser-auth';
import { USER_AUTH_IJTOKEN } from 'src/services/authentication/user-auth.token';
import { SubSink } from 'subsink';
import { StringResKeys } from './locale/string-res-keys';
import { NotificationsViewModel } from './notifications.service';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent implements OnInit, OnDestroy {
  left = XPosition.left;

  private subscriptions = new SubSink();
  private pubId = this.userAuth.getPubId()!;

  notifications?: INotification[];

  constructor(
    private notificationVM: NotificationsViewModel,
    private localeService: LocaleService,
    private cdRef: ChangeDetectorRef,
    @Inject(USER_AUTH_IJTOKEN) private userAuth: IUserAuth
  ) {}

  ngOnInit(): void {
    this.notificationVM.getAllNotifications$().subscribe((notifications) => {
      this.notifications = notifications;
      this.cdRef.detectChanges();
    });
  }

  getNotificationDate(timestamp: Timestamp) {
    const notificationDate = DateUtil.getLocalDateTime(timestamp);
    const timeDiffFromNowInDays = DateUtil.diffFromNow(
      notificationDate,
      'days'
    ).days;

    const isNotUptoADayOrGreaterThan3Days =
      timeDiffFromNowInDays < 1 || timeDiffFromNowInDays > 3;
    if (isNotUptoADayOrGreaterThan3Days) {
      return DateUtil.getHumanReadbleDateTime(notificationDate);
    } else if (timeDiffFromNowInDays === 1) {
      return this.localeService.translate(StringResKeys.yesterday);
    } else {
      return this.localeService.paramTranslate(StringResKeys.xDaysAgo, {
        value: timeDiffFromNowInDays,
      });
    }
  }

  deleteAllNotifications() {
      this.notificationVM.deleteAllNotifications(
        Collection.PUBLISHERS,
        [this.pubId, Collection.NOTIFICATIONS],
        this.notifications!
      );
  }

  deleteANotification(notifID: string) {
    this.notificationVM.deleteANotification(notifID!, this.pubId);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
