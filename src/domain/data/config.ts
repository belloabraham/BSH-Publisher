import { Route } from "./route";

export class Config {
  static readonly APP_NAME = 'Bookshelf Hub';
  static readonly EMAIL_SIGNIN_REDIRECT_URI =
    `https://pubs.bookshelfhub.com/${Route.verifyEmail}`;
}