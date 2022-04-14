export class Collection {
  //*publishers/pubId/{pubData}
  //*Allow all permission except delete if owner and is authenticated.Allow read if admin
  static readonly PUBLISHERS = 'publishers';

  //*publishers/pubId/{pubData}/payment_details/pubId/{Payment details}
  //*Allow all permission except delete if owner and authenticated, allow read if admin
  static readonly PAYMENT_DETAILS = 'payment_details';

  //*publishers/pubId/{pubData}/notifications/docId/{notification data}
  //*Allow read if owner, allow delete if owner, allow for others if false.
  static readonly NOTIFICATIONS = 'notifications';

  //*published_books/bookId/{book info, book Id, pub Id}/
  //*Allow all if admin, allow read only if authenticated, allow modified published if owner
  //*Delete books from pending approval if added to published
  static readonly PUBLISHED_BOOKS = 'published_books';

  //*collaborators/colabId/{CollabData}/books/bookId/{bookData}
  static readonly COLLABORATORS = 'collaborators';

  static readonly INVENTORY = 'inventory';

  //*earnings/bookId/{pubId, bookId, totalEarnings, totalPaid}
  static readonly EARNINGS = 'earnings';

  //*ordered_books/docId/{orderedBooksData}
  static readonly ORDERED_BOOKS = 'ordered_books';
}
