export class Collection {
  //*publishers/pubId/{pubData}
  //*Allow all permission except delete if owner and is authenticated.Allow read if admin
  static readonly PUBLISHERS = 'publishers';

  //*payment_details/pubId/{Payment details}
  //*Allow all permission except delete if owner and authenticated, allow read if admin
  static readonly PAYMENT_DETAILS = 'payment_details';

  //*publishers/pubId/{pubData}/notifications/docId/{notification data}
  //*Allow read if owner, allow delete if owner, allow for others if false.
  static readonly NOTIFICATIONS = 'notifications';

  //*published_books/bookId/{book info, book Id, pub Id}/
  //*Allow all if admin, allow read only if authenticated, allow modified published if owner
  //*Delete books from pending approval if added to published
  static readonly PUBLISHED_BOOKS = 'published_books';

  //*publishers/pubId/{pubData}/collaborators/collabID(email)/{collborators info, collabId (email), collabBooksId, pubId}
  static readonly COLLABORATORS = 'collaborators';

  /*books_pending_approval/IS12344555 or ID243545433/{book info, rejected, book Id, pub Id}/
  Allow read, update if owner and is authenticated. Allow delete and read if admin
  static readonly booksPendingApproval = 'books_pending_approval';*/
}
