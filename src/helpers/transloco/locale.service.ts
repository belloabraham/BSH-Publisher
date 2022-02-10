import { Injectable } from '@angular/core';
import { TranslocoEvents, TranslocoService } from '@ngneat/transloco';
import { Observable, ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Providers } from 'src/data/providers';

@Injectable({
  providedIn: Providers.root
})
export class LocaleService {

  private isLangLoadSuccessfully = new ReplaySubject<boolean>(0)

  constructor(private translocoService: TranslocoService) { }

  setIsLangLoadSuccessfully(value:boolean) {
    this.isLangLoadSuccessfully.next(value)
  }


  getIsLangLoadSuccessfullyObs() {
    return this.isLangLoadSuccessfully
  }


  onLangLoadSuccess(lang:string): Observable<TranslocoEvents>{
    this.translocoService.load(lang)
    return this.translocoService.events$.pipe(
      filter(e => e.type === 'translationLoadSuccess')
    )
  }

  scopeTranslate(key:string, scope:string, params:{value:string}|{}):string{
    return  this.translocoService.translate(key, params, scope);
  }

  lazyScopeTranslate(key:string, scope:string, params:{value:string}|{}){
   return this.translocoService.selectTranslate(key, params, scope)
  }

  paramTranslate(key:string, params:{value:string}|{}):string{
    return  this.translocoService.translate(key, params);
  }

  translate(key:string):string{
    return  this.translocoService.translate(key);
  }
}
