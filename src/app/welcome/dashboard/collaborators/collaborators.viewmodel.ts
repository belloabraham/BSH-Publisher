import { Inject, Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { MaxCachedItem } from 'src/domain/data/max-cached-item';
import { DATABASE_IJTOKEN } from 'src/domain/data/remote-data-source/database.token';
import { IDatabase } from 'src/domain/data/remote-data-source/idatabase';
import { IPaymentDetails } from 'src/domain/models/entities/ipayment-details';

@Injectable()
export class CollaboratorsViewModel {

  private paymentInfo$ = new ReplaySubject<IPaymentDetails>(MaxCachedItem.ONE);

  constructor(@Inject(DATABASE_IJTOKEN) private remoteData: IDatabase) {}

  getPaymentInfo() {
    return this.paymentInfo$;
  }

  addPaymentInfo(paymentInfo: IPaymentDetails) {
    this.paymentInfo$.next(paymentInfo);
  }

  updatePaymentInfo(paymentInfo: IPaymentDetails) {}
}
