import { Injectable} from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { MaxCachedItem } from 'src/data/max-cached-item';
import { ICollaborators } from 'src/data/models/entities/icollaborators';
import { Providers } from 'src/data/providers';

@Injectable({
  providedIn:Providers.ANY
})
export class CollaborationsViewModel {
  private collaborations$ = new ReplaySubject<ICollaborators[]>(
    MaxCachedItem.ONE
  );
  collaborations: ICollaborators[] = [];

  constructor() {}

  getCollaborations$() {
    return this.collaborations$;
  }

  setCollaborations(collaborations: ICollaborators[]) {
    this.collaborations = collaborations;
  }
}