export class Collection {

  //*publishers/pubId/{pubData}
  //*Allow all permission except delete if owner and is authenticated.Allow read if admin
  static readonly publishers = 'publishers';

  //*payment_details/pubId/{Payment detaisl}
  //*Allow all permission except delete if owner and authenticated, allow read if admin
  static readonly paymentDetails = 'payment_details';

  //*notifications/PubId(Publishers only as message will be be sent by cloud funtion)/{notification data}
  //*Allow read if owner, allow delete if owner, allow for others if false.
  static readonly notifications = 'notifications';

  //*published_books/IS12344555 or ID243545433/{Book info, book Id, pubId}/collaborators/collabID(userId)/{collborators info, collabId (userId), pubId}
  //*Allow all if admin, allow read only if authenticated
  //*Delete books from pending approval if added to published
  static readonly publishedBooks = 'published_books';

  //*books_pending_approval/IS12344555 or ID243545433/{book info, rejected, book Id, pub Id}/
  //*Allow read, update if owner and is authenticated. Allow delete and read if admin
  static readonly booksPendingApproval = 'books_pending_approval';
}
