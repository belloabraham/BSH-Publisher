import { Collection } from 'src/data/remote-data-source/collection';

export class CloudStoragePath {
  //*published_books/pubId/bookId(s)/{bookId as File Name}
  static readonly publishedBooks = Collection.PUBLISHED_BOOKS;
}
