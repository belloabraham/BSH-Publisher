import { IPaymentDetails } from './ipayment-details';

export interface IPaymentRequest {
  paymentDetails: IPaymentDetails;
  pubId: string;
  bookName: string;
  bookId: string;
  sellingCurrency: string;
  amount: number;
}
