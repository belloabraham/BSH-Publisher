import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Languages } from 'src/data/languages';
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

  constructor(private localeService: LocaleService) { 
  }

  ngOnInit(): void {
    this.subscriptions.sink = this.localeService
      .loadLanguage(Languages.english)
      .subscribe(() => {
        this.localeService.setIsLangLoadSuccessfully(true);
      });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }


}
