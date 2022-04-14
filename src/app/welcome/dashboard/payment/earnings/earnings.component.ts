import { TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { IEarnings } from 'src/data/models/entities/iearnings';
import { IPublishedBook } from 'src/data/models/entities/ipublished-books';
import { SubSink } from 'subsink';
import { PublishedBookViewModel } from '../../published-book.viewmodel';
import { PaymentDetailsViewModel } from '../payment-details.viewmodel';

@Component({
  selector: 'app-earnings',
  templateUrl: './earnings.component.html',
  styleUrls: ['./earnings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EarningsComponent implements OnInit, OnDestroy {
  private subscriptions = new SubSink();
  earnings?: IEarnings[];
  allPublisedBooks: IPublishedBook[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private publishedBooksVM: PublishedBookViewModel,
    private paymentDetailsVM: PaymentDetailsViewModel
  ) {}

  ngOnInit(): void {
    this.subscriptions.sink = this.publishedBooksVM
      .getAllBooks$()
      .subscribe((allBooks) => {
        this.allPublisedBooks.concat(allBooks);
      });

    this.subscriptions.sink = this.activatedRoute.data
      .pipe(map((data) => data['earnings']))
      .subscribe((earnings) => {
        if (earnings) {
          this.earnings = earnings;
        }
      });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  requestPayment(booId: string) {
    const paymentDetails = this.paymentDetailsVM.getPaymentDetails()
    if (paymentDetails) {
      

    } else {
      //*Show alert with the message of add payment details
    }
  }

  getBookName(bookId: string) {
    return this.allPublisedBooks.find((book) => book.bookId === bookId)?.name;
  }
}
