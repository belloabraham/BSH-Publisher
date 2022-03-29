import { Injectable } from '@angular/core';

@Injectable()
export class IncomingRouteService {

  private _route = '';

  public get route(): string{
    return this._route;
  }
  public set route(value: string) {
    this._route = value;
  }

  constructor() { }
  
}
