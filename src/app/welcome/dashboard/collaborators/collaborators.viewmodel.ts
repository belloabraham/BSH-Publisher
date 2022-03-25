import { Inject, Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { MaxCachedItem } from 'src/domain/data/max-cached-item';
import { IPaymentDetails } from 'src/domain/models/entities/ipayment-details';
import { DATABASE_IJTOKEN } from 'src/domain/remote-data-source/database.token';
import { IDatabase } from 'src/domain/remote-data-source/idatabase';

@Injectable()
export class PaymentInfoViewModel {

  private paymentInfo$ = new ReplaySubject<IPaymentDetails>(MaxCachedItem.one);

  constructor(@Inject(DATABASE_IJTOKEN) private remoteData: IDatabase) {}

  getPaymentInfo() {
    return this.paymentInfo$;
  }

  addPaymentInfo(paymentInfo: IPaymentDetails) {
    this.paymentInfo$.next(paymentInfo);
  }

  updatePaymentInfo(paymentInfo: IPaymentDetails) {}
}
