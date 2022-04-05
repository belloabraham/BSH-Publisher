import { Inject, Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { MaxCachedItem } from 'src/data/max-cached-item';
import { DATABASE_IJTOKEN } from 'src/data/remote-data-source/database.token';
import { IDatabase } from 'src/data/remote-data-source/idatabase';
import { ICollaborators as ICollaborator } from 'src/data/models/entities/icollaborators';

@Injectable()
export class CollaboratorsViewModel {
  private collaborators$ = new ReplaySubject<ICollaborator[]>(
    MaxCachedItem.ONE
  );

  constructor(@Inject(DATABASE_IJTOKEN) private remoteData: IDatabase) {}

  getCollaborators() {
    return this.collaborators$;
  }

  setCollaborators(collaborators: ICollaborator[]) {
    this.collaborators$.next(collaborators);
  }
  
}
