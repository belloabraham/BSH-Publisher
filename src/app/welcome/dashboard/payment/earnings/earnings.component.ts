import { LyTheme2, shadowBuilder, ThemeVariables, YPosition } from '@alyle/ui';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { PubDataViewModel } from 'src/app/welcome/pub-data.service';
import { IEarnings } from 'src/data/models/entities/iearnings';
import { IPaymentDetails } from 'src/data/models/entities/ipayment-details';
import { IPaymentRequest } from 'src/data/models/entities/ipayment-request';
import { IPublishedBook } from 'src/data/models/entities/ipublished-books';
import { Collection } from 'src/data/remote-data-source/collection';
import { Route } from 'src/data/route';
import { NotificationBuilder } from 'src/helpers/notification/notification-buider';
import { AlertDialog } from 'src/helpers/utils/alert-dialog';
import { Logger } from 'src/helpers/utils/logger';
import { IUserAuth } from 'src/services/authentication/iuser-auth';
import { USER_AUTH_IJTOKEN } from 'src/services/authentication/user-auth.token';
import { LocaleService } from 'src/services/transloco/locale.service';
import { SubSink } from 'subsink';
import { PublishedBookViewModel } from '../../published-book.service';
import { PaymentDetailsViewModel } from '../payment-details.service';
import { StringResKeys } from './locale/string-res-keys';


const styles = (theme: ThemeVariables) => ({
  shadow: {
    boxShadow: shadowBuilder(1),
  },
});

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
  private pubId = this.userAuth.getPubId()!;
  bottom = YPosition.below;
  sellingCurrency = this.pubDataVM.getPublisher()?.sellingCurrency;

  readonly classes = this.theme.addStyleSheet(styles);

  constructor(
    private theme: LyTheme2,
    private activatedRoute: ActivatedRoute,
    private localeService: LocaleService,
    private router: Router,
    private publishedBooksVM: PublishedBookViewModel,
    private paymentDetailsVM: PaymentDetailsViewModel,
    private pubDataVM: PubDataViewModel,
    @Inject(USER_AUTH_IJTOKEN) private userAuth: IUserAuth
  ) {}

  ngOnInit(): void {
    this.subscriptions.sink = this.publishedBooksVM
      .getAllBooks$()
      .subscribe((allBooks) => {
        this.allPublisedBooks.push(...allBooks);
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

  async requestPayment(bookId: string) {
    const paymentDetails = this.paymentDetailsVM.getPaymentDetails();
    if (paymentDetails) {
      const notification = new NotificationBuilder().build();

      try {
        const paymentRequest = this.getPaymentRequest(bookId, paymentDetails);
        await this.paymentDetailsVM.sendPaymentRequest(
          Collection.PAYMENT_REQUEST,
          [bookId],
          paymentRequest
        );
        const sucessMsg = this.localeService.translate(
          StringResKeys.paymentReqSuccessMsg
        );
        notification.success(sucessMsg);
      } catch (error) {
        Logger.error(this, this.requestPayment.name, error);
        const errorMsg = this.localeService.translate(
          StringResKeys.paymentReqErrorMsg
        );
        notification.error(errorMsg);
      }
    } else {
      this.showPaymentRequiredAlert();
    }
  }

  private getPaymentRequest(
    bookId: string,
    paymentDetails: IPaymentDetails
  ): IPaymentRequest {
    const bookName = this.getBookName(bookId)!;
    return {
      paymentDetails: paymentDetails,
      pubId: this.pubId,
      bookName: bookName,
      bookId: bookId,
      sellingCurrency: this.sellingCurrency!,
      amount: 0,
      id: this.generatePaymentRequestID(),
    };
  }

  private generatePaymentRequestID() {
    const fiveDigit = `${Math.floor(10000 + Math.random() * 90000)}`;
    return `id-${fiveDigit}`;
  }

  private showPaymentRequiredAlert() {
    const msg = this.localeService.translate(
      StringResKeys.paymentDetailsReqMsg
    );
    const title = this.localeService.translate(
      StringResKeys.paymentDetailsReqTitle
    );
    const actionTxt = this.localeService.translate(
      StringResKeys.addPaymentDetails
    );
    AlertDialog.error(msg, title, actionTxt, () => {
      this.router.navigate([Route.WELCOME, Route.DASHBOARD, Route.PAYMENT]);
    });
  }

  getBookName(bookId: string) {
    return this.allPublisedBooks.find((book) => book.bookId === bookId)?.name;
  }
}
