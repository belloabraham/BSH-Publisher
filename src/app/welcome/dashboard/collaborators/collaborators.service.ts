import { Inject, Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { MaxCachedItem } from 'src/data/max-cached-item';
import { DATABASE_IJTOKEN } from 'src/data/remote-data-source/database.token';
import { IDatabase } from 'src/data/remote-data-source/idatabase';
import { ICollaborators } from 'src/data/models/entities/icollaborators';
import { Collection } from 'src/data/remote-data-source/collection';
import { IUserAuth } from 'src/services/authentication/iuser-auth';
import { USER_AUTH_IJTOKEN } from 'src/services/authentication/user-auth.token';

@Injectable()
export class CollaboratorsViewModel {

  private pubId = this.userAuth.getPubId()!

  private collaborators$ = new ReplaySubject<ICollaborators[]>(
    MaxCachedItem.ONE
  );

  constructor(
    @Inject(DATABASE_IJTOKEN) private remoteData: IDatabase,
    @Inject(USER_AUTH_IJTOKEN) private userAuth: IUserAuth
  ) {}

  getCollaborators$() {
    return this.collaborators$;
  }

  updateCollaborator(collabIdAndBookId:string, field:string, value:any) {
    return this.remoteData.updateDocField(
      Collection.PUBLISHERS,
      [this.pubId, Collection.COLLABORATORS, collabIdAndBookId],
      field,value
    )
  }

   getRemoteCollaborators() {
    return  this.remoteData.getArrayOfDocData<ICollaborators>(
      Collection.PUBLISHERS,
      [this.pubId, Collection.COLLABORATORS])
  }

  setCollaborators(collaborators: ICollaborators[]) {
    this.collaborators$.next(collaborators);
  }
}
