import { Inject, Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { MaxCachedItem } from 'src/data/max-cached-item';
import { Collection } from 'src/data/remote-data-source/collection';
import { DATABASE_IJTOKEN } from 'src/data/remote-data-source/database.token';
import { IDatabase } from 'src/data/remote-data-source/idatabase';
import { IPaymentDetails } from 'src/data/models/entities/ipayment-details';
import { IPaymentRequest } from 'src/data/models/entities/ipayment-request';
import { PaymentType } from 'src/data/payment-type';
import { CryptoUtil } from 'src/helpers/utils/crypto';
import { serverTimestamp } from '@angular/fire/firestore';


@Injectable()
export class PaymentDetailsViewModel {
  private paymentDetails?: IPaymentDetails;

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
        paymentDetails.paymentDetails.lastUpdated = undefined;
        this.setPaymentDetails(paymentDetails.paymentDetails);
      });
  }

  getPaymentDetails() {
    return this.paymentDetails;
  }

  getDecrpytedPaymentDetails(pubId: string) {

    const decrytedPaymentDetails:IPaymentDetails = {
      paymentType:this.paymentDetails!!.paymentType
    }

    if (this.paymentDetails?.lastUpdated === undefined) {
      decrytedPaymentDetails.lastUpdated = serverTimestamp()
    }

    if (this.paymentDetails!!.paymentType === PaymentType.bankTransfer) {
      decrytedPaymentDetails.accountName = CryptoUtil.getDecrypted(
        this.paymentDetails!!.accountName!!,
        pubId
      );
      decrytedPaymentDetails.accountNumber = CryptoUtil.getDecrypted(
        this.paymentDetails!!.accountNumber!!,
        pubId
      );
      decrytedPaymentDetails.bankName = CryptoUtil.getDecrypted(
        this.paymentDetails!!.bankName!!,
        pubId
      );

      decrytedPaymentDetails.bankCountry = CryptoUtil.getDecrypted(
        this.paymentDetails!!.bankCountry!!,
        pubId
      );

      if (this.paymentDetails?.bankRoutingNumber) {

        decrytedPaymentDetails.bankRoutingNumber = CryptoUtil.getDecrypted(
          this.paymentDetails!!.bankRoutingNumber!!,
          pubId
        );

        decrytedPaymentDetails.bankSwiftCode = CryptoUtil.getDecrypted(
          this.paymentDetails!!.bankSwiftCode!!,
          pubId
        );
        decrytedPaymentDetails.bankAddress = CryptoUtil.getDecrypted(
          this.paymentDetails!!.bankAddress!!,
          pubId
        );

        decrytedPaymentDetails.residentialAddress = CryptoUtil.getDecrypted(
          this.paymentDetails!!.residentialAddress!!,
          pubId
        );

        decrytedPaymentDetails.accountType = CryptoUtil.getDecrypted(
          this.paymentDetails!!.accountType!!,
          pubId
        );

      }
    }

    if (this.paymentDetails!!.paymentType === PaymentType.payPal) {
      decrytedPaymentDetails.paypalEmail = CryptoUtil.getDecrypted(
        this.paymentDetails!!.paypalEmail!!,
        pubId
      );
    }

    if (this.paymentDetails!!.paymentType === PaymentType.skrill) {
      decrytedPaymentDetails.skrillEmail = CryptoUtil.getDecrypted(
        this.paymentDetails!!.skrillEmail!!,
        pubId
      );
    }

    return decrytedPaymentDetails;
  }

  sendPaymentRequest(
    collection: string,
    pathSegment: string[],
    paymentReq: IPaymentRequest
  ) {
    return this.remoteData.addDocData(collection, pathSegment, paymentReq);
  }

  setPaymentDetails(paymentDetails: IPaymentDetails) {
    this.paymentDetails = paymentDetails;
    this.paymentDetails$.next(this.paymentDetails);
  }
}
