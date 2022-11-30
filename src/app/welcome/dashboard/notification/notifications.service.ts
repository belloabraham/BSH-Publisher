import { Inject, Injectable } from '@angular/core';
import { QueryConstraint, Unsubscribe } from '@angular/fire/firestore';
import { ReplaySubject } from 'rxjs';
import { MaxCachedItem } from 'src/data/max-cached-item';
import { Collection } from 'src/data/remote-data-source/collection';
import { DATABASE_IJTOKEN } from 'src/data/remote-data-source/database.token';
import { Fields } from 'src/data/remote-data-source/fields';
import { IDatabase } from 'src/data/remote-data-source/idatabase';
import { INotification } from 'src/data/models/entities/inotifications';
import { IDocId } from 'src/data/models/idoc-id';

@Injectable()
export class NotificationsViewModel {
  private notifications$ = new ReplaySubject<INotification[]>(
    MaxCachedItem.ONE
  );
  private notifications: INotification[] = [];

  constructor(@Inject(DATABASE_IJTOKEN) private remoteData: IDatabase) {}

  getAllNotifications$() {
    return this.notifications$;
  }

  postNotifications(notifications: INotification[]) {
    this.notifications = notifications
    this.notifications$.next(this.notifications);
  }

  deleteANotification(docId: string, pubId: string) {
    return this.remoteData.deleteDoc(Collection.PUBLISHERS, [
      pubId,
      Collection.NOTIFICATIONS,
      docId,
    ]);
  }

  getLiveNotifications<T>(
    pubId: string,
    queryConstraints: QueryConstraint[],
    onNext: (type: INotification[], arrayOfDocIds: string[]) => void,
    onError: (errorCode: string) => void
  ): Unsubscribe {
    return this.remoteData.getLiveArrayOfDocData<INotification>(
      Collection.PUBLISHERS,
      [pubId, Collection.NOTIFICATIONS],
      queryConstraints,
      onNext,
      onError
    );
  }

  deleteAllNotifications(
    path: string,
    pathSegment: string[],
    docIds: IDocId[]
  ) {
    return this.remoteData.deleteAllDocs(path, pathSegment, docIds);
  }

  markUnreadNotificationsAsRead(
    pubId: string,
    unreadNotifications: INotification[]
  ) {
    this.remoteData.updateAllDocData(
      Collection.PUBLISHERS,
      [pubId, Collection.NOTIFICATIONS],
      Fields.isRead,
      true,
      unreadNotifications
    );
  }
}
