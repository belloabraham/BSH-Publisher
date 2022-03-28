export class Collection {
  //*publishers/pubId/{pubData}
  //*Allow all permission except delete if owner and is authenticated.Allow read if admin
  static readonly publishers = 'publishers';

  //*payment_details/pubId/{Payment details}
  //*Allow all permission except delete if owner and authenticated, allow read if admin
  static readonly paymentDetails = 'payment_details';

  //*publishers/pubId/{pubData}/notifications/docId/{notification data}
  //*Allow read if owner, allow delete if owner, allow for others if false.
  static readonly notifications = 'notifications';

  //*published_books/IS12344555 or ID243545433/{book info, book Id, pub Id}/
  //*Allow all if admin, allow read only if authenticated, allow modified published if owner
  //*Delete books from pending approval if added to published
  static readonly publishedBooks = 'published_books';

  //*published_books/IS12344555 or ID243545433/{Book info, book Id, pubId}/collaborators/collabID(email)/{collborators info, collabId (email), pubId}
  static readonly collaborators = 'collaborators';

  //*books_pending_approval/IS12344555 or ID243545433/{book info, rejected, book Id, pub Id}/
  //*Allow read, update if owner and is authenticated. Allow delete and read if admin
  static readonly booksPendingApproval = 'books_pending_approval';
}
