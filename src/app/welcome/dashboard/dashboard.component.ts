import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  ActivatedRoute,
  ResolveEnd,
  ResolveStart,
  Router,
} from '@angular/router';
import { filter, map, mapTo, merge, Observable } from 'rxjs';
import { LocaleService } from 'src/services/transloco/locale.service';
import { Shield } from 'src/helpers/utils/shield';
import { IUserAuth } from 'src/services/authentication/iuser-auth';
import { USER_AUTH_IJTOKEN } from 'src/services/authentication/user-auth.token';
import { FirebaseRemoteConfigService } from 'src/services/remote-config/firebase/firebase-remote-config.service';
import { IRemoteConfig } from 'src/services/remote-config/i-remote-config';
import { RemoteConfig } from 'src/services/remote-config/remote-config';
import { REMOTE_CONFIG_IJTOKEN } from 'src/services/remote-config/remote.config.token';
import { SubSink } from 'subsink';
import { StringResKeys } from './locale/string-res-keys';

import { XPosition, YPosition } from '@alyle/ui';
import { Settings } from 'src/data/settings';
import { Route } from 'src/data/route';
import { Config } from 'src/data/config';
import { PublishedBookViewModel } from './published-book.viewmodel';
import { IPublishedBook } from 'src/data/models/entities/ipublished-books';
import { NotificationsViewModel } from './notification/notifications.viewmodel';
import { INotification } from 'src/data/models/entities/inotifications';
import { Unsubscribe, where } from '@angular/fire/firestore';
import { Logger } from 'src/helpers/utils/logger';
import { PubDataViewModel } from '../pub-data.viewmodels';
import { IncomingRouteService } from 'src/app/shared/incoming-route.service';
import { Fields } from 'src/data/remote-data-source/fields';
import { SalesRecordViewModel } from './sales-record/sales-record.viewmodel';
import { CloudFunctionService } from 'src/services/function/firebase/cloud-function.service';
import { CLOUD_FUNCTIONS } from 'src/services/function/function-token';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [
    {
      provide: REMOTE_CONFIG_IJTOKEN,
      useClass: FirebaseRemoteConfigService,
    },
    {
      provide: CLOUD_FUNCTIONS,
      useClass: CloudFunctionService,
    },
    NotificationsViewModel,
    SalesRecordViewModel,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit, OnDestroy {
  private subscriptions = new SubSink();

  bottom = YPosition.below;
  top = YPosition.above;

  left = XPosition.left;
  right = XPosition.right;

  openLeftNav = false;
  openRightNav = false;

  isNewNotification = false;

  collaboratorsRoute = Route.COLLABORATORS;
  collaborationsRoute = Route.COLLABORATIONS;
  paymentRoute = Route.PAYMENT;
  myBooksRoute = Route.MY_BOOKS;
  adminLink = `${location.origin}/${Route.WELCOME}/${Route.ADMIN}`;
  profileRoute = Route.PROFILE;
  publishBookRoute = Route.PUBLISH_YOUR_BOOK;
  salesRecordRoute = Route.SALES_RECORD;

  private showLoaderEvent$!: Observable<boolean>;
  private hideLoaderEvent$!: Observable<boolean>;

  feedbackLink = this.remoteConfig.getString(RemoteConfig.feedBackLink);
  helpLink = this.remoteConfig.getString(RemoteConfig.helpLink);

  newNotifications: INotification[] = [];
  pubId = this.userAuth.getPubId()!;

  pubFirstName = '';
  unsubscribeFromNotification!: Unsubscribe;
  isAdmin =  this.userAuth.isAdmin();

  constructor(
    private title: Title,
    private localeService: LocaleService,
    @Inject(REMOTE_CONFIG_IJTOKEN) private remoteConfig: IRemoteConfig,
    @Inject(USER_AUTH_IJTOKEN) private userAuth: IUserAuth,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private allBooksVM: PublishedBookViewModel,
    private notificationVM: NotificationsViewModel,
    private cdRef: ChangeDetectorRef,
    private pubDataVM: PubDataViewModel,
    private incomingRouteS: IncomingRouteService
  ) {
    this.isOpenLeftNav();
  }

  ngOnInit(): void {

    this.listenForBookChanges();
    this.listenForPubDataChanges();

    this.getStrinRes();

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
        Shield.standard('.dashboard-main', 'Loading please wait...');
      } else {
        Shield.remove('.dashboard-main');
      }
    });

    this.getLiveNotifications();
  }

  setIncomingRoute() {
    this.incomingRouteS.route = this.router.url;
  }

  private listenForBookChanges() {
    this.subscriptions.sink = this.activatedRoute.data
      .pipe(map((data) => data['allBooks']))
      .subscribe((allBooks: IPublishedBook[]) => {
        this.allBooksVM.setAllBooks(allBooks);
      });
  }

  private listenForPubDataChanges() {
    this.subscriptions.sink = this.pubDataVM
      .getPublisher$()
      .subscribe((pubData) => {
        this.pubFirstName = pubData.firstName;
      });
  }

  toggleNotificationPanel() {
    this.isNewNotification = false;
    this.openRightNav = !this.openRightNav;
    this.notificationVM.markUnreadNotificationsAsRead(
      this.pubId,
      this.newNotifications
    );
  }

  private getLiveNotifications() {
    const onNext = (
      notifications: INotification[],
      arrayOfDocIds: string[]
    ) => {
      for (let index = 0; index < arrayOfDocIds.length; index++) {
        notifications[index].docId = arrayOfDocIds[index];
      }

      this.newNotifications = notifications.filter(
        (notification) => notification.isRead === false
      );

      this.isNewNotification =
        this.newNotifications.length > 0 && !this.openRightNav;

      if (this.isNewNotification) {
        this.cdRef.detectChanges();
      }

      const notificationsToPost =
        notifications.length > 0 ? notifications : null;
      this.notificationVM.postNotifications(notificationsToPost);
    };

    const onError = (errorCode: string) => {
      Logger.error(
        'DashboardComponent',
        this.getLiveNotifications.name,
        errorCode
      );
    };

    const queryConstraints = [where(Fields.message, '!=', '')];

    this.unsubscribeFromNotification = this.notificationVM.getLiveNotifications(
      this.pubId,
      queryConstraints,
      onNext,
      onError
    );
  }

  private getStrinRes() {
    this.subscriptions.sink = this.localeService
      .getIsLangLoadSuccessfullyObs()
      .subscribe((_) => {
        this.setTitle();
      });
  }

  logout() {
    this.userAuth.signOut().then(() => {
      this.router.navigateByUrl(Route.ROOT);
    });
  }

  private setTitle() {
    this.title.setTitle(
      this.localeService.paramTranslate(StringResKeys.title, {
        value: Config.APP_NAME,
      })
    );
  }

  isOpenLeftNav() {
    const value = localStorage.getItem(Settings.IS_DASHBOARD_COLLAPSED);
    if (value === 'true') {
      this.openLeftNav = true;
    } else {
      this.openLeftNav = false;
    }
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
    this.unsubscribeFromNotification();
  }
}
