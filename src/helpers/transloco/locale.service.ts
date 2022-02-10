import { Injectable } from '@angular/core';
import { TranslocoEvents, TranslocoService } from '@ngneat/transloco';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Providers } from 'src/data/providers';

@Injectable({
  providedIn: Providers.root
})
export class LocaleService {

  constructor(private translocoService: TranslocoService) { }

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
