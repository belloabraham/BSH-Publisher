import { Inject, Injectable } from '@angular/core';
import { endAt, orderBy, startAt, where } from '@angular/fire/firestore';
import { ReplaySubject } from 'rxjs';
import { MaxCachedItem } from 'src/data/max-cached-item';
import { DATABASE_IJTOKEN } from 'src/data/remote-data-source/database.token';
import { Fields } from 'src/data/remote-data-source/fields';
import { IDatabase } from 'src/data/remote-data-source/idatabase';
import { Logger } from 'src/helpers/utils/logger';
import { IUserAuth } from 'src/services/authentication/iuser-auth';
import { USER_AUTH_IJTOKEN } from 'src/services/authentication/user-auth.token';

@Injectable()
export class SalesRecordViewModel {
  private salesRecord$ = new ReplaySubject<string[][]>(MaxCachedItem.ONE);

  private pubId = this.userAuth.getPubId()!

  constructor(
    @Inject(DATABASE_IJTOKEN) private remoteData: IDatabase,
    @Inject(USER_AUTH_IJTOKEN) private userAuth: IUserAuth
  ) {}

  getSalesRecord$() {
    return this.salesRecord$;
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
        where(Fields.year, '==', year),
        where(Fields.pubId, '==', this.pubId),
        orderBy(Fields.month),
        startAt(fromMonth),
        endAt(toMonth),
      ];

      const arrayOfDocData = await this.remoteData.getQuerySnapshotWhere(
        path,
        pathSegment,
        queryConstraint
      );

      const dataArray: string[][] = [];
      arrayOfDocData.forEach((queryDoc) => {
        if (queryDoc.exists()) {
          const data = queryDoc.data();
          const json = JSON.stringify(data);
          const type = JSON.parse(json);
          dataArray.push([
             type.name,
             type.bookId,
            type.additionInfo,
          ]);
        }
      });

      this.salesRecord$.next(dataArray);
    } catch (error) {
      Logger.error(this, this.getSalesRecord.name, error);
    }
  }
}
