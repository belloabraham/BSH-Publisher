import { Inject, Injectable } from '@angular/core';
import { QueryConstraint } from '@angular/fire/firestore';
import { ReplaySubject } from 'rxjs';
import { MaxCachedItem } from 'src/domain/data/max-cached-item';
import { Collection } from 'src/domain/data/remote-data-source/collection';
import { DATABASE_IJTOKEN } from 'src/domain/data/remote-data-source/database.token';
import { Fields } from 'src/domain/data/remote-data-source/fields';
import { IDatabase } from 'src/domain/data/remote-data-source/idatabase';
import { INotification } from 'src/domain/models/entities/inotifications';
import { IDocId } from 'src/domain/models/idoc-id';

@Injectable()
export class NotificationsViewModel {
  private notifications$ = new ReplaySubject<INotification[] | null>(
    MaxCachedItem.ONE
  );

  constructor(@Inject(DATABASE_IJTOKEN) private remoteData: IDatabase) {}

  getAllNotifications$() {
    return this.notifications$;
  }

  addNotifications(notifications: INotification[] | null) {
    this.notifications$.next(notifications);
  }

  deleteANotification(docId: string, pubId: string) {
    return this.remoteData.deleteDoc(Collection.publishers, [
      pubId,
      Collection.notifications,
      pubId,
    ]);
  }

  getLiveNotifications<T>(
    pubId: string,
    queryConstraints: QueryConstraint[],
    onNext: (type: INotification[], arrayOfDocIds: string[]) => void,
    onError: (errorCode: string) => void
  ) {
    this.remoteData.getLiveArrayOfDocData<INotification>(
      Collection.publishers,
      [pubId, Collection.notifications],
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
      Collection.publishers,
      [pubId, Collection.notifications],
      Fields.isRead,
      true,
      unreadNotifications
    );
  }
}
