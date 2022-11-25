import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { ErrorService } from 'src/app/error/error.service';
import { IPublishedBook } from 'src/data/models/entities/ipublished-books';
import { Providers } from 'src/data/providers';
import { Route } from 'src/data/route';
import { Logger } from 'src/helpers/utils/logger';
import { UnapprovedPublishedBooksViewMdel } from '../unapproved-published-books.service';

@Injectable({
  providedIn: Providers.ANY,
})
export class UnapprovedPublishedBooksResolver
  implements Resolve<IPublishedBook[] | null>
{
  constructor(
    private unApprovedBooksVM: UnapprovedPublishedBooksViewMdel,
    private router: Router,
    private errorService: ErrorService
  ) {}

  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<IPublishedBook[] | null> {
    try {
      return await this.unApprovedBooksVM.getUnApprovedPublishedBooks();
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
