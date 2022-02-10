import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { LocaleService } from 'src/helpers/transloco/locale.service';
import { SubSink } from 'subsink';
import { StringResKey } from './locale/string-res-keys';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent implements OnInit, OnDestroy {
  private subscriptions = new SubSink();
  constructor(
    cdRef: ChangeDetectorRef,
    private title: Title,
    private localeService: LocaleService
  ) {
    cdRef.detach;
  }

  ngOnInit(): void {
    this.subscriptions.sink = this.localeService
      .getIsLangLoadSuccessfullyObs()
      .subscribe((value) => {
        this.title.setTitle(
          this.localeService.translate(StringResKey.title)
        );
      })
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
