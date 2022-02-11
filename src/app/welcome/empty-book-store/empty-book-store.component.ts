import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { LocaleService } from 'src/helpers/transloco/locale.service';
import { SubSink } from 'subsink';
import { StringResKeys } from './locale/string-res-keys';

@Component({
  selector: 'app-empty-book-store',
  templateUrl: './empty-book-store.component.html',
  styleUrls: ['./empty-book-store.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class EmptyBookStoreComponent implements OnInit, OnDestroy {
  private subscriptions = new SubSink();
  constructor(
    private title: Title,
    private localeService: LocaleService
  ) {
  }

  ngOnInit(): void {
    this.subscriptions.sink = this.localeService
      .getIsLangLoadSuccessfullyObs()
      .subscribe((_) => {
        this.title.setTitle(this.localeService.translate(StringResKeys.title));
      });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
