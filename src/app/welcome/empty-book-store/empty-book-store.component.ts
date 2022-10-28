import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { IncomingRouteService } from 'src/app/shared/incoming-route.service';
import { Config } from 'src/data/config';
import { Route } from 'src/data/route';
import { LocaleService } from 'src/services/transloco/locale.service';
import { IUserAuth } from 'src/services/authentication/iuser-auth';
import { USER_AUTH_IJTOKEN } from 'src/services/authentication/user-auth.token';
import { SubSink } from 'subsink';
import { PubDataViewModel } from '../pub-data.viewmodels';
import { StringResKeys } from './locale/string-res-keys';


@Component({
  selector: 'app-empty-book-store',
  templateUrl: './empty-book-store.component.html',
  styleUrls: ['./empty-book-store.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyBookStoreComponent implements OnInit, OnDestroy {
  private subscriptions = new SubSink();
  pubFirstName = ''
  isAdmin = this.userAuth.isAdmin()

  constructor(
    private title: Title,
    private localeService: LocaleService,
    @Inject(USER_AUTH_IJTOKEN) private userAuth: IUserAuth,
    private router: Router,
    private pubDataVM: PubDataViewModel,
    private incomingRouteS:IncomingRouteService
  ) {
  }

  ngOnInit(): void {
    this.getStringRes();
    this.listenForChangesInPubData()
  }

  private listenForChangesInPubData() {
   this.subscriptions.sink =  this.pubDataVM.getPublisher$()
      .subscribe(pubData => {
      this.pubFirstName = pubData.firstName
    })
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

  addABook() {
    this.incomingRouteS.route = this.router.url
    this.router.navigate([Route.WELCOME, Route.PUBLISH_YOUR_BOOK]);
  }

  gotoAdminDashBoard() {
    this.incomingRouteS.route = this.router.url
    this.router.navigate([Route.WELCOME, Route.ADMIN]);
  }

  logout() {
    this.userAuth.signOut().then(() => this.router.navigateByUrl(Route.ROOT));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
