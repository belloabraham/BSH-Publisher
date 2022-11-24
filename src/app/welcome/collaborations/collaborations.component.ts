import {
  ChangeDetectionStrategy,
  OnDestroy,
  Component,
  OnInit,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Config } from 'src/data/config';
import { LocaleService } from 'src/services/transloco/locale.service';
import { SubSink } from 'subsink';
import { StringResKeys } from './locale/string-res-keys';

@Component({
  selector: 'app-collaborations',
  templateUrl: './collaborations.component.html',
  styleUrls: ['./collaborations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollaborationsComponent implements OnInit, OnDestroy{
  private subscriptions = new SubSink();

  constructor(private title: Title, private localeService: LocaleService) {}

  ngOnInit(): void {
    this.getStringRes();
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

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}


