import { Inject, Injectable } from '@angular/core';
import { endAt, orderBy, startAt, where } from '@angular/fire/firestore';
import { ReplaySubject } from 'rxjs';
import { MaxCachedItem } from 'src/data/max-cached-item';
import { IOrderedBooks } from 'src/data/models/entities/iordered-books';
import { DATABASE_IJTOKEN } from 'src/data/remote-data-source/database.token';
import { IDatabase } from 'src/data/remote-data-source/idatabase';
import { Logger } from 'src/helpers/utils/logger';

@Injectable()
export class SalesRecordViewModel {
  private salesRecord$ = new ReplaySubject<any[]>(MaxCachedItem.ONE);

    constructor(@Inject(DATABASE_IJTOKEN) private remoteData: IDatabase) { }
    
   
    getSalesRecord$() {
        return this.salesRecord$
    }

  async getSalesRecord(
    path: string,
    pathSegment: string[],
    year: number,
    fromMonth: number,
    toMonth: number
  ) {
    try {
      const queryConstraint = [
        where('year', '==', year),
        orderBy('month'),
        startAt(fromMonth),
        endAt(toMonth),
      ];

      const arrayOfDocData = await this.remoteData.getQuerySnapshotWhere(
        path,
        pathSegment,
        queryConstraint
      );

      const dataArray: IOrderedBooks[] = [];
      arrayOfDocData.forEach((queryDoc) => {
        if (queryDoc.exists()) {
          const data = queryDoc.data();
          const json = JSON.stringify(data);
          const type = JSON.parse(json);
          dataArray.concat({
            name: type.name,
            bookId: type.bookId,
            additionalInfo: type.additionInfo,
          });
          }
      });
        
    this.salesRecord$.next(dataArray)
    } catch (error) {
        Logger.error(this, this.getSalesRecord.name, error)
    }
  }
}
