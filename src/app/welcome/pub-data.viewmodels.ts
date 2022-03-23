import { Inject, Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { MaxCachedItem } from 'src/domain/data/max-cached-item';
import { IPublisher } from 'src/domain/models/entities/ipublisher';
import { DATABASE_IJTOKEN } from 'src/domain/remote-data-source/database.token';
import { IDatabase } from 'src/domain/remote-data-source/idatabase';

@Injectable()
export class PubDataViewModel {

  private pubData$ = new ReplaySubject<IPublisher>(MaxCachedItem.one);

  constructor(@Inject(DATABASE_IJTOKEN) private remoteData: IDatabase) {}

  getPublisher() {
    return this.pubData$;
  }

  setPublisher(publisher: IPublisher) {
    this.pubData$.next(publisher);
  }

  updatePublisher(publisher: IPublisher, pubId:string) {}
}