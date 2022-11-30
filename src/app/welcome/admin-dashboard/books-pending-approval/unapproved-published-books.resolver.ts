import {Inject, Injectable } from '@angular/core';
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { ErrorService } from 'src/app/error/error.service';
import { IPublishedBook } from 'src/data/models/entities/ipublished-books';
import { Providers } from 'src/data/providers';
import { DATABASE_IJTOKEN } from 'src/data/remote-data-source/database.token';
import { Fields } from 'src/data/remote-data-source/fields';
import { IDatabase } from 'src/data/remote-data-source/idatabase';
import { Route } from 'src/data/route';
import { Logger } from 'src/helpers/utils/logger';
import { where } from '@angular/fire/firestore';
import { Collection } from 'src/data/remote-data-source/collection';


@Injectable({
  providedIn: Providers.ANY,
})
export class UnapprovedPublishedBooksResolver
  implements Resolve<IPublishedBook[] | null>
{
  constructor(
    private router: Router,
    @Inject(DATABASE_IJTOKEN) private remoteData: IDatabase,
    private errorService: ErrorService
  ) {}

  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<IPublishedBook[] | null> {

    try {
      const queryConstraint = where(Fields.approved, '==', false);
      return await this.remoteData.getArrayOfDocDataWhere<IPublishedBook>(
        Collection.PUBLISHED_BOOKS,
        [],
        [queryConstraint]
      );
    } catch (error) {
      Logger.error(
        'UnapprovedPublishedBooksResolver',
        this.resolve.name,
        error
      );
      this.errorService.errorRoute = [Route.WELCOME, Route.ADMIN];
      this.router.navigateByUrl(Route.ERROR);
      return null;
    }
  }
}
