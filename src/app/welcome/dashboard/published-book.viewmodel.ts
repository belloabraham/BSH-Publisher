import { Inject, Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { IPublishedBook } from 'src/data/models/entities/ipublished-books';
import { MaxCachedItem } from 'src/data/max-cached-item';
import { DATABASE_IJTOKEN } from 'src/data/remote-data-source/database.token';
import { IDatabase } from 'src/data/remote-data-source/idatabase';
import { Collection } from 'src/data/remote-data-source/collection';
import { where } from '@angular/fire/firestore';
import { Fields } from 'src/data/remote-data-source/fields';
import { USER_AUTH_IJTOKEN } from 'src/services/authentication/user-auth.token';
import { IUserAuth } from 'src/services/authentication/iuser-auth';

@Injectable()
export class PublishedBookViewModel {
  private allBooks$ = new ReplaySubject<IPublishedBook[]>(MaxCachedItem.ONE);
  private pubId = this.userAuth.getPubId()!;

  constructor(
    @Inject(DATABASE_IJTOKEN) private remoteData: IDatabase,
    @Inject(USER_AUTH_IJTOKEN) private userAuth: IUserAuth
  ) {}

  getAllBooks$() {
    return this.allBooks$;
  }

  setAllBooks(publishedBooks: IPublishedBook[]) {
    this.allBooks$.next(publishedBooks);
  }

  getAllPublishedBook() {
    const queryConstraint = where(Fields.pubId, '==', this.pubId);
    return this.remoteData.getArrayOfDocDataWhere<IPublishedBook>(
      Collection.PUBLISHED_BOOKS,
      [],
      [queryConstraint]
    );
  }

  async unPublishBook(
    path: string,
    pathSegment: string[],
    field: string,
    value: any
  ) {
    return await this.remoteData
      .updateDocField(path, pathSegment, field, value)
      .then(() => {
        return this.getAllPublishedBook().then((books) => {
          this.setAllBooks(books);
        });
      });
  }

  publishMyBook(publishedBooks: IPublishedBook, pubId: string) {}
}
