import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Config } from 'src/data/config';
import { LocaleService } from 'src/helpers/transloco/locale.service';
import { SubSink } from 'subsink';
import { StringResKeys } from './locale/string-res-keys';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit, OnDestroy {

  private subscriptions = new SubSink();
  
  constructor(
    private title: Title,
    private localeService: LocaleService,
    cdRef:ChangeDetectorRef
  ) {
    cdRef.detach()
  }

  ngOnInit(): void {
    this.subscriptions.sink = this.localeService
      .getIsLangLoadSuccessfullyObs()
      .subscribe(_ => {
        this.title.setTitle(
          this.localeService.paramTranslate(StringResKeys.title, {
            value: Config.appName,
          })
        );
      })
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
