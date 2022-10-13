import { Injectable } from '@angular/core';
import {TranslocoService } from '@ngneat/transloco';
import { ReplaySubject } from 'rxjs';
import { MaxCachedItem } from 'src/data/max-cached-item';
import { Providers } from 'src/data/providers';

@Injectable({
  providedIn: Providers.ROOT,
})
export class LocaleService {
  private isLangLoadSuccessfully = new ReplaySubject<boolean>(MaxCachedItem.ONE);

  constructor(private translocoService: TranslocoService) {}

  setIsLangLoadSuccessfully(value: boolean) {
    this.isLangLoadSuccessfully.next(value);
  }

  getIsLangLoadSuccessfullyObs() {
    return this.isLangLoadSuccessfully;
  }

  loadLanguage(lang: string) {
    return this.translocoService.load(lang);
  }

  scopeTranslate(
    key: string,
    scope: string,
    params: { value: string } | {}
  ): string {
    return this.translocoService.translate(key, params, scope);
  }

  lazyScopeTranslate(
    key: string,
    scope: string,
    params: { value: string } | {}
  ) {
    return this.translocoService.selectTranslate(key, params, scope);
  }

  paramTranslate(key: string, params: { value: string } | {}): string {
    return this.translocoService.translate(key, params);
  }

  translate(key: string): string {
    return this.translocoService.translate(key);
  }
}
