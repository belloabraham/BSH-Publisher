import { Injectable } from '@angular/core';
import { Providers } from 'src/data/providers';

@Injectable({
  providedIn: Providers.ROOT,
})
export class RouteDataVewModel {
  private _bookId: string | null = null;
  public get bookIdToEdit(): string | null {
    return this._bookId;
  }
  public set bookIdToEdit(v: string | null) {
    this._bookId = v;
  }

  constructor() {}
}
