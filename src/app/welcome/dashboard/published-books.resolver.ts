import { Inject, Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { ErrorService } from 'src/app/error/error.service';
import { IPublishedBook } from 'src/data/models/entities/ipublished-books';
import { Providers } from 'src/data/providers';
import { Route } from 'src/data/route';
import { Logger } from 'src/helpers/utils/logger';
import { IUserAuth } from 'src/services/authentication/iuser-auth';
import { USER_AUTH_IJTOKEN } from 'src/services/authentication/user-auth.token';
import { PublishedBookViewModel } from './my-books/published-book.viewmodel';

@Injectable({
  providedIn: Providers.ANY,
})
export class PublishedBooksResolver
  implements Resolve<IPublishedBook[] | null>
{

  constructor(
    private publishedBooksVM: PublishedBookViewModel,
    @Inject(USER_AUTH_IJTOKEN) private userAuth: IUserAuth,
    private router: Router,
    private errorService: ErrorService
  ) {}

  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<IPublishedBook[] | null> {
     try {
      const pubId = this.userAuth.getPubId()!;       
       const allBooks = await this.publishedBooksVM.getAllPublishedBook(pubId)

      const isBookExist = allBooks.length > 0;
      if (!isBookExist) {
        //   this.router.navigate([Route.welcome, Route.emptyBookStore]);
        return null;
      }
      return allBooks;
    } catch (error: any) {

      Logger.error('PublishedBooksResolver', this.resolve.name, error.message);
      this.errorService.errorRoute = [Route.WELCOME, Route.DASHBOARD];
      this.router.navigateByUrl(Route.ERROR);
      return null;
    }
  }

}
