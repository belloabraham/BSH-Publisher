
import { Inject, Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { MaxCachedItem } from 'src/data/max-cached-item';
import { IPaymentRequest } from 'src/data/models/entities/ipayment-request';
import { DATABASE_IJTOKEN } from 'src/data/remote-data-source/database.token';
import { IDatabase } from 'src/data/remote-data-source/idatabase';

@Injectable()
export class PaymentRequestViewModel {
  private allPaymentRequest$ = new ReplaySubject<IPaymentRequest[]>(
    MaxCachedItem.ONE
  );
  private allPaymentRequest: IPaymentRequest[] = [];

  constructor(@Inject(DATABASE_IJTOKEN) private remoteData: IDatabase) {}

  getPaymentReq$() {}

  setPaymentRequest(value: IPaymentRequest[]) {
    this.allPaymentRequest = value;
    this.allPaymentRequest$.next(this.allPaymentRequest)
  }
  
}