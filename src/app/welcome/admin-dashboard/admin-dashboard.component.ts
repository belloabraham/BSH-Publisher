import { XPosition } from '@alyle/ui';
import {
  ChangeDetectionStrategy,
  Inject,
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { SubSink } from 'subsink';
import { PubDataViewModel } from '../pub-data.service';
import { Route } from 'src/data/route';
import { Settings } from 'src/data/settings';
import { IUserAuth } from 'src/services/authentication/iuser-auth';
import { USER_AUTH_IJTOKEN } from 'src/services/authentication/user-auth.token';
import { ResolveEnd, ResolveStart, Router } from '@angular/router';
import { LocaleService } from 'src/services/transloco/locale.service';
import { Title } from '@angular/platform-browser';
import { StringResKeys } from './locale/string-res-keys';
import { Config } from 'src/data/config';
import { filter, mapTo, merge, Observable } from 'rxjs';
import { Shield } from 'src/helpers/utils/shield';
import { PaymentRequestViewModel } from './publishers-payment-request/payment-request.service';
import { UnapprovedPublishedBooksViewMdel } from './books-pending-approval/unapproved-published-books.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  pubFirstName = '';
  private subscriptions = new SubSink();
  openLeftNav = false;
  right = XPosition.right;

  paymentReqRoute = Route.PAYMENT_REQUEST;
  pendingApprovalRoute = Route.PENDING_APPROVAL;

  private showLoaderEvent$!: Observable<boolean>;
  private hideLoaderEvent$!: Observable<boolean>;

  constructor(
    private pubDataVM: PubDataViewModel,
    private title: Title,
    private localeService: LocaleService,
    @Inject(USER_AUTH_IJTOKEN) private userAuth: IUserAuth,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getStringRes();
    this.listenForPubDataChanges();

    this.showLoaderEvent$ = this.router.events.pipe(
      filter((e) => e instanceof ResolveStart),
      mapTo(true)
    );

    this.hideLoaderEvent$ = this.router.events.pipe(
      filter((e) => e instanceof ResolveEnd),
      mapTo(false)
    );

    this.subscriptions.sink = merge(
      this.hideLoaderEvent$,
      this.showLoaderEvent$
    ).subscribe((isResolving) => {
      if (isResolving) {
        Shield.standard('.admin-dashboard-main', 'Loading please wait...');
      } else {
        Shield.remove('.admin-dashboard-main');
      }
    });
  }

  private getStringRes() {
    this.subscriptions.sink = this.localeService
      .getIsLangLoadSuccessfullyObs()
      .subscribe((_) => {
        this.title.setTitle(
          this.localeService.paramTranslate(StringResKeys.title, {
            value: Config.APP_NAME,
          })
        );
      });
  }

  private listenForPubDataChanges() {
    this.subscriptions.sink = this.pubDataVM
      .getPublisher$()
      .subscribe((pubData) => {
        this.pubFirstName = pubData.firstName;
      });
  }

  logout() {
    this.userAuth.signOut().then(() => {
      this.router.navigateByUrl(Route.ROOT);
    });
  }

  toggleLeftNav() {
    this.openLeftNav = !this.openLeftNav;
    let value = 'false';
    if (this.openLeftNav === true) {
      value = 'true';
    }
    localStorage.setItem(Settings.IS_DASHBOARD_COLLAPSED, value);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
