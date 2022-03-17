import { Route } from "./route";

export class Config {
  static readonly appName = 'Bookshelf Hub';
  static readonly emailSignInRedirectURI =
    `https://pubs.bookshelfhub.com/${Route.verifyEmail}`;
}