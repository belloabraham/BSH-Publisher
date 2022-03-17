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
import { ThemeVariables, LyTheme2 } from '@alyle/ui';


import {
  XPosition,
  YPosition,
  } from '@alyle/ui';
import { Display } from 'src/helpers/utils/display';
import { Settings } from 'src/domain/data/settings';
import { Route } from 'src/domain/data/route';
import { Config } from 'src/domain/data/config';
import { IDatabase } from 'src/domain/remote-data-source/idatabase';
import { DATABASE_IJTOKEN } from 'src/domain/remote-data-source/database.token';

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

  bottom = YPosition.below;
  top = YPosition.above;

  left = XPosition.left;
  right = XPosition.right;

  openLeftNav = false;
  openRightNav = false;

  collaborators = Route.collaborators;
  payment = Route.payment;
  myBooks = Route.myBooks;
  profile = Route.profile;

  private showLoaderEvent$!: Observable<boolean>;
  private hideLoaderEvent$!: Observable<boolean>;

  feedbackLink = this.remoteConfig.getString(RemoteConfig.feedBackLink);
  helpLink = this.remoteConfig.getString(RemoteConfig.helpLink);

  toolTipFontSize = Display.remToPixel(1.2).toString();

  //Customized theme for Alyle Tooltip
  readonly classes = this._theme.addStyle(
    'LyTooltip',
    (theme: ThemeVariables) => ({
      borderRadius: '4px',
      fontSize: this.toolTipFontSize,
      padding: '0 8px 4px',
      opacity: 1,
      transition: `opacity ${theme.animations.curves.standard} 200ms`,
      left: 0,
    }),
    undefined,
    undefined,
    -2
  );

  constructor(
    private title: Title,
    private localeService: LocaleService,
    @Inject(DATABASE_IJTOKEN) private database: IDatabase,
    @Inject(REMOTE_CONFIG_IJTOKEN) private remoteConfig: IRemoteConfig,
    @Inject(USER_AUTH_IJTOKEN) private userAuth: IUserAuth,
    private router: Router,
    private _theme: LyTheme2
  ) {
    this.isOpenLeftNav();
  }

  ngOnInit(): void {

    this.getStrinRes()

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
