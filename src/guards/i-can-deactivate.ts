import { Observable } from 'rxjs';

export interface ICanDeactivate {
  canExit: () => Observable<boolean> | Promise<boolean> | boolean;
}
