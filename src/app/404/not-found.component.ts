import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Route } from 'src/data/route';
import { LocaleService } from 'src/helpers/transloco/locale.service';
import { SubSink } from 'subsink';
import { StringResKeys } from './locale/string-res-keys';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent implements OnInit, OnDestroy {
  private subscriptions = new SubSink();
  constructor(
    private title: Title,
    private localeService: LocaleService,
    private router:Router
  ) {
  }


  goHome() {
    this.router.navigateByUrl(Route.root)
  }

  ngOnInit(): void {
    this.subscriptions.sink = this.localeService
      .getIsLangLoadSuccessfullyObs()
      .subscribe(_ => {
        this.title.setTitle(
          this.localeService.translate(StringResKeys.title)
        );
      })
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }


}
