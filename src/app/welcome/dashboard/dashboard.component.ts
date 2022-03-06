import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ResolveEnd, ResolveStart, Router } from '@angular/router';
import { filter, mapTo, merge, Observable } from 'rxjs';
import { Config } from 'src/data/config';
import { Route } from 'src/data/route';
import { LocaleService } from 'src/helpers/transloco/locale.service';
import { Logger } from 'src/helpers/utils/logger';
import { Shield } from 'src/helpers/utils/shield';
import { IUserAuth } from 'src/services/authentication/iuser-auth';
import { USER_AUTH_IJTOKEN } from 'src/services/authentication/user-auth.token';
import { DATABASE_IJTOKEN } from 'src/services/database/database.token';
import { IDatabase } from 'src/services/database/idatabase';
import { FirebaseRemoteConfigService } from 'src/services/remote-config/firebase/firebase-remote-config.service';
import { IRemoteConfig } from 'src/services/remote-config/i-remote-config';
import { RemoteConfig } from 'src/services/remote-config/remote-config';
import { REMOTE_CONFIG_IJTOKEN } from 'src/services/remote-config/remote.config.token';
import { SubSink } from 'subsink';
import { StringResKeys } from './locale/string-res-keys';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [
    {
      provide: REMOTE_CONFIG_IJTOKEN,
      useClass: FirebaseRemoteConfigService,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit, OnDestroy {
  private subscriptions = new SubSink();

  openLeftNav = false;
  openRightNav = false;

  collaborators = Route.collaborators;
  payment = Route.payment;
  myBooks = Route.myBooks;
  profile = Route.profile;
  notifications= Route.notifications

  private showLoaderEvent$!: Observable<boolean>;
  private hideLoaderEvent$!: Observable<boolean>;

  feedbackLink = this.remoteConfig.getString(RemoteConfig.feedBackLink);
  helpLink = this.remoteConfig.getString(RemoteConfig.helpLink);

  constructor(
    private title: Title,
    private localeService: LocaleService,
    @Inject(DATABASE_IJTOKEN) private database: IDatabase,
    @Inject(REMOTE_CONFIG_IJTOKEN) private remoteConfig: IRemoteConfig,
    @Inject(USER_AUTH_IJTOKEN) private userAuth: IUserAuth,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscriptions.sink = this.localeService
      .getIsLangLoadSuccessfullyObs()
      .subscribe((_) => {
        this.setTitle();
      });

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

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
