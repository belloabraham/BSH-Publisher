export interface IPublishedBook {
  bookId: string;
  name: string;
  author: string;
  coverUrl: string;
  totalDownloads: number;
  description: string;
  category: string;
  tag: string | undefined;
  sellerCurrency: string;
  totalReviews: number;
  totalRatings: number;
  publishedDate: any;
  lastUpdated: any;
  approved: boolean;
  published: boolean;
  pubId: string;
  price: number;
  recommended: boolean;
  serialNo?: number;
}
