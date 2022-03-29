import { Inject, Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { MaxCachedItem } from 'src/domain/data/max-cached-item';
import { IPaymentDetails } from 'src/domain/models/entities/ipayment-details';
import { Collection } from 'src/domain/remote-data-source/collection';
import { DATABASE_IJTOKEN } from 'src/domain/remote-data-source/database.token';
import { IDatabase } from 'src/domain/remote-data-source/idatabase';

@Injectable()
export class PaymentInfoViewModel {
  private paymentDetails$ = new ReplaySubject<IPaymentDetails>(
    MaxCachedItem.ONE
  );

  constructor(@Inject(DATABASE_IJTOKEN) private remoteData: IDatabase) {}

  getPaymentDetails() {
    return this.paymentDetails$;
  }

  updatePaymentDetails(paymentDetails: IPaymentDetails, pubId: string) {
      return this.remoteData.addDocData(
        Collection.paymentDetails,
        [pubId],
        paymentDetails,
        { merge: false }
      )
  }

  setPaymentDetails(paymentDetails: IPaymentDetails) {
    this.paymentDetails$.next(paymentDetails);
  }

}
