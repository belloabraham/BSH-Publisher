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
import {  merge, Observable, of } from 'rxjs';
import { filter, map, mapTo } from 'rxjs/operators';
import { Config } from 'src/domain/data/config';
import { Languages } from 'src/domain/data/languages';
import { LocaleService } from 'src/helpers/transloco/locale.service';
import { SubSink } from 'subsink';


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
  isLoading$!: Observable<boolean>;
  isStarting$: Observable<boolean> = of(true);
  isNotConnected$: Observable<boolean> = of(true);
  showPreloader$!:Observable<boolean>;


  constructor(
    private localeService: LocaleService,
    title: Title,
    private connectionService: ConnectionService,
    private router: Router,
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

    this.showPreloader$ = merge(this.hideLoaderEvent$, this.isStarting$);
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
