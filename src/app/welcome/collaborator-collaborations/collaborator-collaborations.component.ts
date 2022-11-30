import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  Inject,
  OnInit,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ResolveEnd, ResolveStart, Router } from '@angular/router';
import { CollaborationsViewModel } from 'src/app/shared/collaborations/collaborations.service';
import { Config } from 'src/data/config';
import { ICollaborators } from 'src/data/models/entities/icollaborators';
import { LocaleService } from 'src/services/transloco/locale.service';
import { SubSink } from 'subsink';
import { StringResKeys } from '../../welcome/collaborator-collaborations/locale/string-res-keys';
import { filter, map, mapTo, merge, Observable } from 'rxjs';
import { Shield } from 'src/helpers/utils/shield';
import { XPosition } from '@alyle/ui';
import { Route } from 'src/data/route';
import { Settings } from 'src/data/settings';
import { IUserAuth } from 'src/services/authentication/iuser-auth';
import { USER_AUTH_IJTOKEN } from 'src/services/authentication/user-auth.token';
import { PubDataViewModel } from '../pub-data.service';
import { REMOTE_CONFIG_IJTOKEN } from 'src/services/remote-config/remote.config.token';
import { FirebaseRemoteConfigService } from 'src/services/remote-config/firebase/firebase-remote-config.service';
import { IRemoteConfig } from 'src/services/remote-config/i-remote-config';
import { RemoteConfig } from 'src/services/remote-config/remote-config';
import { CloudFunctionService } from 'src/services/function/firebase/cloud-function.service';
import { CLOUD_FUNCTIONS } from 'src/services/function/function-token';

@Component({
  selector: 'app-collaborator-collaborations',
  templateUrl: './collaborator-collaborations.component.html',
  styleUrls: ['./collaborator-collaborations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: REMOTE_CONFIG_IJTOKEN,
      useClass: FirebaseRemoteConfigService,
    },
    {
      provide: CLOUD_FUNCTIONS,
      useClass: CloudFunctionService,
    },
    CollaborationsViewModel,
  ],
})
export class CollaboratorCollaborationsComponent implements OnInit, OnDestroy {
  private subscriptions = new SubSink();

  feedbackLink = this.remoteConfig.getString(RemoteConfig.feedBackLink);
  helpLink =  this.remoteConfig.getString(RemoteConfig.helpLink);

  pubFirstName = '';
  openLeftNav = false;
  right = XPosition.right;

  profileRoute = Route.PROFILE;
  collaborationsRoute = Route.COLLABORATIONS;
  paymentRoute = Route.PAYMENT;

  private showLoaderEvent$!: Observable<boolean>;
  private hideLoaderEvent$!: Observable<boolean>;
  constructor(
    private title: Title,
    private collaborationsVM: CollaborationsViewModel,
    private localeService: LocaleService,
    private activatedRoute: ActivatedRoute,
    private pubDataVM: PubDataViewModel,
    @Inject(REMOTE_CONFIG_IJTOKEN) private remoteConfig: IRemoteConfig,
    @Inject(USER_AUTH_IJTOKEN) private userAuth: IUserAuth,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscriptions.sink = this.activatedRoute.data
      .pipe(map((data) => data['collaborations']))
      .subscribe((collaborations: ICollaborators[]) => {
        this.collaborationsVM.setCollaborations(collaborations);
      });

    this.getStringRes();

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
        Shield.standard(
          '.collaborations-dashboard-main',
          'Loading please wait...'
        );
      } else {
        Shield.remove('.collaborations-dashboard-main');
      }
    });

    this.listenForPubDataChanges();
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
    localStorage.setItem(Settings.IS_COLLABORATORS_DASHBOARD_COLLAPSED, value);
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

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
