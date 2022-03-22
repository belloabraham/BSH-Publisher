import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LocaleService } from 'src/helpers/transloco/locale.service';
import { SubSink } from 'subsink';
import { StringResKeys } from './locale/string-res-keys';
import { Location } from '@angular/common';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorComponent implements OnInit, OnDestroy {
  private subscriptions = new SubSink();

  constructor(
    private title: Title,
    private localeService: LocaleService,
    private router: Router,
    private location: Location
  ) {
  }

  tryAgain() {
    this.location.back()
  }

  ngOnInit(): void {
    this.getStrinRes();
  }

  private getStrinRes() {
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
