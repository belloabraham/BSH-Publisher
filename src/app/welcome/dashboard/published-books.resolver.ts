import {  Inject, Injectable } from '@angular/core';
import { where } from '@angular/fire/firestore';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { ErrorService } from 'src/app/shared/error.service';
import { IPublishedBook } from 'src/domain/data/ipublished-books';
import { Providers } from 'src/domain/data/providers';
import { Route } from 'src/domain/data/route';
import { Collection } from 'src/domain/remote-data-source/collection';
import { DATABASE_IJTOKEN } from 'src/domain/remote-data-source/database.token';
import { Fields } from 'src/domain/remote-data-source/fields';
import { IDatabase } from 'src/domain/remote-data-source/idatabase';
import { Logger } from 'src/helpers/utils/logger';
import { IUserAuth } from 'src/services/authentication/iuser-auth';
import { USER_AUTH_IJTOKEN } from 'src/services/authentication/user-auth.token';

@Injectable({
  providedIn: Providers.any,
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
      let allBooks = await this.remoteData.getArrayOfDocData<IPublishedBook>(
        Collection.publishedBooks,
        [queryConstraint]
      );

      const isBookExist = allBooks.length > 0;
      if (!isBookExist) {
       this.router.navigate([Route.welcome, Route.emptyBookStore]);
        return null;
      }
      return allBooks;
    } catch (error: any) {
      Logger.error(this, 'resolve', error.message);
      this.errorService.errorRoute = [Route.welcome, Route.dashboard];
      this.router.navigateByUrl(Route.error);
      return null;
    }
  }
}
