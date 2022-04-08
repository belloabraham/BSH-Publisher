import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Config } from 'src/data/config';
import { LocaleService } from 'src/services/transloco/locale.service';
import { SubSink } from 'subsink';
import { StringResKeys } from './locale/string-res-keys';

@Component({
  selector: 'app-unsurported-device',
  templateUrl: './unsurported-device.component.html',
  styleUrls: ['./unsurported-device.component.scss'],
})
export class UnsurportedDeviceComponent implements OnInit, OnDestroy {
  private subscriptions = new SubSink();
  constructor(private title: Title, private localeService: LocaleService) {}

  ngOnInit(): void {
    this.getStringRes()
  }

  private getStringRes() {
    this.subscriptions.sink = this.localeService
      .getIsLangLoadSuccessfullyObs()
      .subscribe((_) => {
        this.setTitle();
      });
  }

  private setTitle() {
    this.title.setTitle(
      this.localeService.paramTranslate(StringResKeys.title, {
        value: Config.APP_NAME,
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
