export class Regex {
  static readonly EMAIL = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  static readonly USER_NAME = '^[^0-9]{2,30}$';
  static readonly ISBN = '^[0-9]{10,13}$';
  static readonly AUTHOR_NAME = '^[.]{2,40}$';
  static readonly PRICE = '^[0-9]*$';
}
