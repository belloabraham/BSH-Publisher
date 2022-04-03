import { Inject, Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { MaxCachedItem } from 'src/domain/data/max-cached-item';
import { Collection } from 'src/domain/data/remote-data-source/collection';
import { DATABASE_IJTOKEN } from 'src/domain/data/remote-data-source/database.token';
import { IDatabase } from 'src/domain/data/remote-data-source/idatabase';
import { IPaymentDetails } from 'src/domain/models/entities/ipayment-details';
@Injectable()
export class PaymentDetailsViewModel {
  private paymentDetails$ = new ReplaySubject<IPaymentDetails>(
    MaxCachedItem.ONE
  );

  constructor(@Inject(DATABASE_IJTOKEN) private remoteData: IDatabase) {}

  getPaymentDetails$() {
    return this.paymentDetails$;
  }

  async updatePaymentDetails(
    paymentDetails: { paymentDetails: IPaymentDetails },
    pubId: string
  ) {
    return await this.remoteData
      .updateDocData(Collection.PUBLISHERS, [pubId], paymentDetails)
      .then((_) => {
        this.setPaymentDetails(paymentDetails.paymentDetails);
      });
  }

  setPaymentDetails(paymentDetails: IPaymentDetails) {
    this.paymentDetails$.next(paymentDetails);
  }
}
