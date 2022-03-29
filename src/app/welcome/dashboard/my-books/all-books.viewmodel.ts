import { Inject, Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { IPublishedBook } from 'src/domain/data/ipublished-books';
import { MaxCachedItem } from 'src/domain/data/max-cached-item';
import { DATABASE_IJTOKEN } from 'src/domain/remote-data-source/database.token';
import { IDatabase } from 'src/domain/remote-data-source/idatabase';

@Injectable()
export class AllBooksViewModel {
  
  private allBooks$ = new ReplaySubject<IPublishedBook[]>(MaxCachedItem.ONE);

  constructor(@Inject(DATABASE_IJTOKEN) private remoteData: IDatabase) {}

  getAllBooks$() {
    return this.allBooks$;
  }

  setAllBooks(publishedBooks: IPublishedBook[]) {
    this.allBooks$.next(publishedBooks);
  }

  publishMyBook(publishedBooks: IPublishedBook, pubId: string) {}
}
