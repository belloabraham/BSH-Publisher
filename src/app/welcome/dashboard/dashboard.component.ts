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
import { LocaleService } from 'src/helpers/transloco/locale.service';
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
import { Settings } from 'src/domain/data/settings';
import { Route } from 'src/domain/data/route';
import { Config } from 'src/domain/data/config';
import { AllBooksViewModel } from './my-books/all-books.viewmodel';
import { IPublishedBook } from 'src/domain/data/ipublished-books';
import { NotificationsViewModel } from './notification/notifications.viewmodel';
import { INotification } from 'src/domain/models/entities/inotifications';
import { where } from '@angular/fire/firestore';
import { Fields } from 'src/domain/remote-data-source/fields';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [
    {
      provide: REMOTE_CONFIG_IJTOKEN,
      useClass: FirebaseRemoteConfigService,
    },
    AllBooksViewModel,
    NotificationsViewModel,
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

  collaborators = Route.collaborators;
  payment = Route.payment;
  myBooks = Route.myBooks;
  profile = Route.profile;
  publishYourBook = Route.publishYourBook;

  private showLoaderEvent$!: Observable<boolean>;
  private hideLoaderEvent$!: Observable<boolean>;

  feedbackLink = this.remoteConfig.getString(RemoteConfig.feedBackLink);
  helpLink = this.remoteConfig.getString(RemoteConfig.helpLink);

  newNotifications: INotification[] = [];
  pubId = this.userAuth.getPubId()!;

  constructor(
    private title: Title,
    private localeService: LocaleService,
    @Inject(REMOTE_CONFIG_IJTOKEN) private remoteConfig: IRemoteConfig,
    @Inject(USER_AUTH_IJTOKEN) private userAuth: IUserAuth,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private allBooksVM: AllBooksViewModel,
    private notificationVM: NotificationsViewModel,
    private cdRef: ChangeDetectorRef
  ) {
    this.isOpenLeftNav();
  }

  ngOnInit(): void {
    this.subscriptions.sink = this.activatedRoute.data
      .pipe(map((data) => data['allBooks']))
      .subscribe((allBooks: IPublishedBook[]) => {
        this.allBooksVM.setAllBooks(allBooks);
      });

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

      const notificationsToAdd =
        notifications.length > 0 ? notifications : null;
      this.notificationVM.addNotifications(notificationsToAdd);
    }

    const onError = (errorCode: string) => {};

    const queryConstraints = [where(Fields.message, '!=', '')];

    this.notificationVM.getLiveNotifications(this.pubId, queryConstraints, onNext, onError)
   
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
      this.router.navigateByUrl(Route.root);
    });
  }

  private setTitle() {
    this.title.setTitle(
      this.localeService.paramTranslate(StringResKeys.title, {
        value: Config.appName,
      })
    );
  }

  isOpenLeftNav() {
    let value = localStorage.getItem(Settings.isDashBoardCollapsed);
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
    localStorage.setItem(Settings.isDashBoardCollapsed, value);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
