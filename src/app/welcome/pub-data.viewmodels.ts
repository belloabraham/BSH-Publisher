import { Inject, Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { MaxCachedItem } from 'src/data/max-cached-item';
import { Providers } from 'src/data/providers';
import { Collection } from 'src/data/remote-data-source/collection';
import { DATABASE_IJTOKEN } from 'src/data/remote-data-source/database.token';
import { IDatabase } from 'src/data/remote-data-source/idatabase';
import { IPublisher } from 'src/data/models/entities/ipublisher';


@Injectable({
  providedIn:Providers.ROOT
})
export class PubDataViewModel {
  private pubData$ = new ReplaySubject<IPublisher>(MaxCachedItem.ONE);

  constructor(@Inject(DATABASE_IJTOKEN) private remoteData: IDatabase) {}

  getPublisher$() {
    return this.pubData$;
  }

  setPublisher(publisher: IPublisher) {
    this.pubData$.next(publisher);
  }

  async updatePublisher(publisher: { pubData: IPublisher }, pubId: string) {
    return await this.remoteData
      .addDocData(Collection.PUBLISHERS, [pubId], publisher)
      .then((_) => {
        this.setPublisher(publisher.pubData);
      });
  }
}
