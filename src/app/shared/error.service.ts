import { Injectable } from '@angular/core';
import { Providers } from 'src/domain/data/providers';

@Injectable({
  providedIn: Providers.ROOT,
})
export class ErrorService {

  private _errorRoute = [''];

  public get errorRoute(): string[] {
    return this._errorRoute;
  }
  public set errorRoute(value: string[]) {
    this._errorRoute = value;
  }
}
