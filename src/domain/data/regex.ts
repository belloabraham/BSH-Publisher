export class Regex {
  static readonly email = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  static readonly userName = '^[^0-9]{2,30}$';
  static readonly isbn = '^[0-9]{10,13}$';
  static readonly authorName = '^[.]{2,40}$';
  static readonly price = '^[0-9]*$';
}
