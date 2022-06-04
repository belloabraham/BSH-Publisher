import { Inject, Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { ErrorService } from 'src/app/error/error.service';
import { Providers } from 'src/data/providers';
import { Collection } from 'src/data/remote-data-source/collection';
import { DATABASE_IJTOKEN } from 'src/data/remote-data-source/database.token';
import { IDatabase } from 'src/data/remote-data-source/idatabase';
import { Route } from 'src/data/route';
import { ICollaborators } from 'src/data/models/entities/icollaborators';
import { Logger } from 'src/helpers/utils/logger';
import { IUserAuth } from 'src/services/authentication/iuser-auth';
import { USER_AUTH_IJTOKEN } from 'src/services/authentication/user-auth.token';

@Injectable({
  providedIn: Providers.ANY,
})
export class CollaboratorsResolver implements Resolve<ICollaborators[] | null> {
  constructor(
    @Inject(DATABASE_IJTOKEN) private remoteData: IDatabase,
    @Inject(USER_AUTH_IJTOKEN) private userAuth: IUserAuth,
    private router: Router,
    private errorService: ErrorService
  ) {}

  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<ICollaborators[] | null> {

    const pubId = this.userAuth.getPubId()!

    try {
      const collaborators = await this.remoteData.getArrayOfDocData<ICollaborators>(Collection.PUBLISHERS, [pubId, Collection.COLLABORATORS])
      const isCollaboratorsExist = collaborators.length > 0
      if (!isCollaboratorsExist) {
        return null
      }
      return collaborators;
    } catch (error) {
      Logger.error("CollaboratorsResolver", this.resolve.name, error)
      this.errorService.errorRoute = [Route.WELCOME, Route.DASHBOARD, Route.COLLABORATORS];
      this.router.navigateByUrl(Route.ERROR);
      return null
    }
  }
}
