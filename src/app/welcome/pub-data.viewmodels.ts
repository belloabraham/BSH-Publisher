import { Inject, Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { MaxCachedItem } from 'src/domain/data/max-cached-item';
import { IPublisher } from 'src/domain/models/entities/ipublisher';
import { Collection } from 'src/domain/remote-data-source/collection';
import { DATABASE_IJTOKEN } from 'src/domain/remote-data-source/database.token';
import { IDatabase } from 'src/domain/remote-data-source/idatabase';

@Injectable()
export class PubDataViewModel {

  private pubData$ = new ReplaySubject<IPublisher>(MaxCachedItem.ONE);

  constructor(@Inject(DATABASE_IJTOKEN) private remoteData: IDatabase) {}

  getPublisher() {
    return this.pubData$;
  }

  setPublisher(publisher: IPublisher) {
    this.pubData$.next(publisher);
  }

  async updatePublisher(publisher: IPublisher, pubId: string) {
    return await this.remoteData.addDocData(Collection.publishers, [pubId], publisher).then(_ => {
       this.setPublisher(publisher)
    });
  }
}
