import { Injectable, Inject } from '@angular/core';
import { where } from '@angular/fire/firestore';
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { ErrorService } from 'src/app/error/error.service';
import { ICollaborators } from 'src/data/models/entities/icollaborators';
import { Providers } from 'src/data/providers';
import { Collection } from 'src/data/remote-data-source/collection';
import { DATABASE_IJTOKEN } from 'src/data/remote-data-source/database.token';
import { Fields } from 'src/data/remote-data-source/fields';
import { IDatabase } from 'src/data/remote-data-source/idatabase';
import { Route } from 'src/data/route';
import { Logger } from 'src/helpers/utils/logger';
import { IUserAuth } from 'src/services/authentication/iuser-auth';
import { USER_AUTH_IJTOKEN } from 'src/services/authentication/user-auth.token';

@Injectable({
  providedIn: Providers.ANY,
})
export class CollaborationsResolver
  implements Resolve<ICollaborators[] | null>
{
  constructor(
    @Inject(DATABASE_IJTOKEN) private remoteData: IDatabase,
    @Inject(USER_AUTH_IJTOKEN) private userAuth: IUserAuth,
    private errorService: ErrorService,
    private router: Router
  ) {}

  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<ICollaborators[] | null> {
    try {
      const pubId = this.userAuth.getPubId();
      const queryConstraint = where(Fields.collabId, '==', pubId);
      return await this.remoteData.getArrayOfDocDataFromCollGroup(
        Collection.COLLABORATORS,
        [queryConstraint]
      );
    } catch (error) {
      Logger.error('CollaborationsResolver', this.resolve.name, error);
      this.errorService.errorRoute = [Route.WELCOME];
      this.router.navigateByUrl(Route.ERROR);
      return null;
    }
  }
}
