import { Inject, Injectable } from '@angular/core';
import { increment } from '@angular/fire/firestore';
import { FieldValue } from 'firebase/firestore';
import { ReplaySubject } from 'rxjs';
import { MaxCachedItem } from 'src/data/max-cached-item';
import { IPaymentRequest } from 'src/data/models/entities/ipayment-request';
import { Providers } from 'src/data/providers';
import { Collection } from 'src/data/remote-data-source/collection';
import { DATABASE_IJTOKEN } from 'src/data/remote-data-source/database.token';
import { IDatabase } from 'src/data/remote-data-source/idatabase';

@Injectable({
  providedIn: Providers.ANY,
})
export class PaymentRequestViewModel {
  private allPaymentRequest$ = new ReplaySubject<IPaymentRequest[]>(
    MaxCachedItem.ONE
  );

  private allPaymentRequest: IPaymentRequest[] = [];

  constructor(@Inject(DATABASE_IJTOKEN) private remoteData: IDatabase) {}

  getPaymentReq$() {
    return this.allPaymentRequest$;
  }

  getDocRef(collection: string, pathSegment: string[]) {
    return this.remoteData.getDocRef(collection, pathSegment);
  }

  updateEarningAndDeletePaymentReqForBookTrans(
    pubId: string,
    bookId: string,
    amount: number
  ) {
    const bookEarningsDocRef = this.getDocRef(Collection.PUBLISHERS, [
      pubId,
      Collection.EARNINGS,
      bookId,
    ]);
    const paymentReqDocRef = this.getDocRef(Collection.PAYMENT_REQUEST, [
      bookId,
    ]);

    return this.remoteData.updateEarningAndDeletePaymentReqForBookTrans(
      bookEarningsDocRef,
      paymentReqDocRef,
      amount
    );
  }

  deletePaymentRequest(bookId: string) {
    return this.remoteData.deleteDoc(Collection.PAYMENT_REQUEST, [bookId]);
  }

  getPaymentRequest() {
    return this.remoteData.getArrayOfDocData<IPaymentRequest>(
      Collection.PAYMENT_REQUEST,
      []
    );
  }

  setPaymentRequest(value: IPaymentRequest[]) {
    this.allPaymentRequest = value;
    this.allPaymentRequest$.next(this.allPaymentRequest);
  }
}
