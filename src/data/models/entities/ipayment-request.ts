import { IPaymentDetails } from './ipayment-details';

export interface IPaymentRequest {
  paymentDetails: IPaymentDetails;

  pubName: string;
  pubEmail: string;
  pubId: string;

  bookName: string;
  bookId: string;
  amount: number;
}
