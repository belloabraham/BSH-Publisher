import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  GuardsCheckEnd,
  NavigationEnd,
  NavigationStart,
  Router,
} from '@angular/router';
import { ConnectionService } from 'ng-connection-service';
import { merge, Observable, of } from 'rxjs';
import { filter, map, mapTo } from 'rxjs/operators';
import { Config } from 'src/data/config';

import { Languages } from 'src/data/languages';
import { LocaleService } from 'src/helpers/transloco/locale.service';
import { SubSink } from 'subsink';
import { lyl, ThemeVariables, StyleRenderer, ThemeRef } from '@alyle/ui';
import { STYLES as STYLES_BUTTON } from '@alyle/ui/button';

const STYLES = (theme: ThemeVariables, ref: ThemeRef) => {
  // Make sure button styles have been rendered
  ref.renderStyleSheet(STYLES_BUTTON);
  // Get selectors
  const button = ref.selectorsOf(STYLES_BUTTON);
  return {
    root: lyl`{
      ${button.root} {
        font-size: 1.2rem
      }
    }`,
  };
};


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [StyleRenderer],
})
export class AppComponent implements OnInit, OnDestroy {
  private subscriptions = new SubSink();
  private showLoaderEvent$!: Observable<boolean>;
  private hideLoaderEvent$!: Observable<boolean>;
  isLoading$!: Observable<boolean>;
  isStarting$: Observable<boolean> = of(true);
  isNotConnected$: Observable<boolean> = of(true);

  readonly classes = this.sRenderer.renderSheet(STYLES, true);

  constructor(
    private localeService: LocaleService,
    title: Title,
    private connectionService: ConnectionService,
    private router: Router,
    readonly sRenderer: StyleRenderer
  ) {
    title.setTitle(Config.appName);
  }

  ngOnInit(): void {
    this.loadLanguageRes();

    this.isNotConnected$ = this.connectionService
      .monitor()
      .pipe(map((connected) => !connected));

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

    this.isStarting$ = this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      mapTo(false)
    );

    this.isLoading$ = merge(this.hideLoaderEvent$, this.showLoaderEvent$);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private loadLanguageRes() {
    this.subscriptions.sink = this.localeService
      .loadLanguage(Languages.english)
      .subscribe(() => {
        this.localeService.setIsLangLoadSuccessfully(true);
      });
  }
}
