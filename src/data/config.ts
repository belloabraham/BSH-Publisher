import { Route } from "./route";

export class Config {
  static readonly APP_NAME = 'Bookshelf Hub';
  static readonly HOME = 'https://pubs.bookshelfhub.com/';
  static readonly EMAIL_SIGNIN_REDIRECT_URI = `${Config.HOME}/${Route.VERIFY_EMAIL}`;
  static readonly defaultFontFamily = 'Source Sans Pro';
  static readonly admins = [
    'p7FMnfdrS0WEHLxXvKKYJGteYvz1', //Ogboriologbo
    'yWn7EK6ScLUqsu3gvCKX9GA0O2q2',
  ];
  static readonly MAX_ALLOWED_COLLAB_COMMISSION = 90;
}