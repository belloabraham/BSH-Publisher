import { Collection } from 'src/domain/data/remote-data-source/collection';

export class CloudStoragePath {
  //*published_books/pubId/bookId(s)/{bookId as File Name}
  static readonly publishedBooks = Collection.publishedBooks;
}
