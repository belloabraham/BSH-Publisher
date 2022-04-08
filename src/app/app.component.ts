import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  GuardsCheckEnd,
  NavigationEnd,
  NavigationStart,
  Router,
} from '@angular/router';
import { ConnectionService } from 'ng-connection-service';
import { merge, Observable, of } from 'rxjs';
import { filter, map, mapTo, shareReplay } from 'rxjs/operators';
import { Config } from 'src/data/config';
import { Languages } from 'src/data/languages';
import { LocaleService } from 'src/services/transloco/locale.service';
import { SubSink } from 'subsink';
import { Route } from 'src/data/route';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  private subscriptions = new SubSink();
  private showLoaderEvent$!: Observable<boolean>;
  private hideLoaderEvent$!: Observable<boolean>;
  private showResolverEvent$!: Observable<boolean>;
  private hideResolverEvent$!: Observable<boolean>;

  isResolving$!: Observable<boolean>;
  isLoading$!: Observable<boolean>;
  isStarting$: Observable<boolean> = of(true);
  isNotConnected$: Observable<boolean> = of(true);
  showPreloader$!: Observable<boolean>;

  isTabletAndAbove$: Observable<boolean> = this.breakpointObserver
    .observe(['(min-width: 767px)'])
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private localeService: LocaleService,
    title: Title,
    private connectionService: ConnectionService,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {
    title.setTitle(Config.APP_NAME);
    this.subscriptions.sink = this.isTabletAndAbove$.subscribe(
      (isTabletAndAbove) => {
        if (!isTabletAndAbove) {
          this.router.navigate([Route.UNSURPOTED_DEVICE])
        }
      }
    );
  }

  ngOnInit(): void {
    this.loadLanguageRes();
    this.isNotConnected$ = this.connectionService
      .monitor()
      .pipe(map((connected) => !connected));

    this.showResolverEvent$ = this.router.events.pipe(
      filter((e) => e instanceof NavigationStart),
      mapTo(true)
    );
    this.hideResolverEvent$ = this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      mapTo(false)
    );

    this.showLoaderEvent$ = this.router.events.pipe(
      filter((e) => e instanceof NavigationStart),
      mapTo(true)
    );
    this.hideLoaderEvent$ = this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      mapTo(false)
    );

    this.hideLoaderEvent$ = this.router.events.pipe(
      filter((e) => e instanceof GuardsCheckEnd),
      mapTo(false)
    );

    this.showPreloader$ = merge(this.hideLoaderEvent$, this.isStarting$);
    this.isLoading$ = merge(this.hideLoaderEvent$, this.showLoaderEvent$);
    this.isResolving$ = merge(this.hideResolverEvent$, this.showResolverEvent$);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private loadLanguageRes() {
    this.subscriptions.sink = this.localeService
      .loadLanguage(Languages.ENGLISH)
      .subscribe(() => {
        this.localeService.setIsLangLoadSuccessfully(true);
      });
  }
}
