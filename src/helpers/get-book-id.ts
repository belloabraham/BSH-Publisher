import { IPublishedBook } from "src/data/models/entities/ipublished-books";

export function getBookId(book: IPublishedBook) {
  return book.bookId.includes(book.pubId)
    ? book.bookId.split('-')[1]
    : book.bookId;
} 