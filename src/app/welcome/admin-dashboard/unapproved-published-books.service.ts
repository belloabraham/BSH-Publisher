import { Inject, Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { MaxCachedItem } from 'src/data/max-cached-item';
import { IPublishedBook } from 'src/data/models/entities/ipublished-books';
import { DATABASE_IJTOKEN } from 'src/data/remote-data-source/database.token';
import { IDatabase } from 'src/data/remote-data-source/idatabase';
import { where } from '@angular/fire/firestore';
import { Fields } from 'src/data/remote-data-source/fields';
import { Collection } from 'src/data/remote-data-source/collection';
import { Providers } from 'src/data/providers';

@Injectable()
export class UnapprovedPublishedBooksViewMdel {
  private allBooks$ = new ReplaySubject<IPublishedBook[]>(MaxCachedItem.ONE);
  private allBooks: IPublishedBook[] = [];

  constructor(@Inject(DATABASE_IJTOKEN) private remoteData: IDatabase) {}

  getUnApprovedPublishedBooks() {
    const queryConstraint = where(Fields.approved, '==', false);
    return this.remoteData.getArrayOfDocDataWhere<IPublishedBook>(
      Collection.PUBLISHED_BOOKS,
      [],
      [queryConstraint]
    );
  }

  getUnApprovedPublishedBooks$() {
    return this.allBooks$;
  }

  setAllBooks(publishedBooks: IPublishedBook[]) {
    this.allBooks = publishedBooks;
    this.allBooks$.next(this.allBooks);
  }
}
