export class Collection {
  //*publishers/pubId/{pubData}
  //*Allow all permission except delete if owner and is authenticated.Allow read if admin
  static readonly PUBLISHERS = 'publishers';

  //*publishers/pubId/{pubData}/notifications/docId/{notification data}
  //*Allow read if owner, allow delete if owner, allow for others if false.
  static readonly NOTIFICATIONS = 'notifications';

  //*published_books/bookId/{book info, book Id, pub Id}/
  static readonly PUBLISHED_BOOKS = 'published_books';

  //*collaborators/colabId/{CollabData}/books/bookId/{bookData}
  static readonly COLLABORATORS = 'collaborators';

  static readonly INVENTORY = 'inventory';

  //*earnings/bookId/{pubId, bookId, totalEarnings, totalPaid}
  static readonly EARNINGS = 'earnings';

  //*ordered_books/docId/{orderedBooksData}
  static readonly ORDERED_BOOKS = 'ordered_books';

  //*payment_request/pubId/{}
  static readonly PAYMENT_REQUEST = 'payment_request';
}
