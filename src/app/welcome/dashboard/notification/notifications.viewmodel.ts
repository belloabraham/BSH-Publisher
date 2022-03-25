import { Inject, Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { MaxCachedItem } from 'src/domain/data/max-cached-item';
import { INotification } from 'src/domain/models/entities/inotifications';
import { DATABASE_IJTOKEN } from 'src/domain/remote-data-source/database.token';
import { IDatabase } from 'src/domain/remote-data-source/idatabase';

@Injectable()
export class NotificationsViewModel {
  private notifications$ = new ReplaySubject<INotification[] | null>(
    MaxCachedItem.one
  );

  constructor(@Inject(DATABASE_IJTOKEN) private remoteData: IDatabase) {}

  getAllNotifications() {
    return this.notifications$;
  }

  addNotifications(notifications: INotification[] | null) {
    this.notifications$.next(notifications);
  }

  deleteANotification(docId: string) {}

  deleteAllNotifications() {}

  markNotificationsAsRead() {}
}
