import {  Inject, Injectable } from '@angular/core';
import { where } from '@angular/fire/firestore';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { ErrorService } from 'src/app/error/error.service';
import { IPublishedBook } from 'src/data/models/entities/ipublished-books';
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
export class PublishedBooksResolver
  implements Resolve<IPublishedBook[] | null>
{
  constructor(
    @Inject(DATABASE_IJTOKEN) private remoteData: IDatabase,
    @Inject(USER_AUTH_IJTOKEN) private userAuth: IUserAuth,
    private router: Router,
    private errorService: ErrorService,
  ) {}

  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<IPublishedBook[] | null> {
    try {
      const pubId = this.userAuth.getPubId()!;
      const queryConstraint = where(Fields.pubId, '==', pubId);
      const allBooks = await this.remoteData.getArrayOfDocDataWhere<IPublishedBook>(
        Collection.PUBLISHED_BOOKS,[],
        [queryConstraint]
      );

      const isBookExist = allBooks.length > 0;
      if (!isBookExist) {
    //   this.router.navigate([Route.welcome, Route.emptyBookStore]);
        return null;
      }
      return allBooks;
    } catch (error: any) {
      Logger.error("PublishedBooksResolver",this.resolve.name, error.message);
      this.errorService.errorRoute = [Route.WELCOME, Route.DASHBOARD];
      this.router.navigateByUrl(Route.ERROR);
      return null;
    }
  }
}
