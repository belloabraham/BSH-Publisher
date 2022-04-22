export interface IPublishedBook {
  bookId: string;
  name: string;
  author: string;
  coverUrl: string;
  totalDownloads: number;
  description: string;
  publishedDate: any;
  category: string;
  tag: string | undefined;
  sellerCurrency: string;
  totalReviews: number;
  totalRatings: number;
  published: boolean;
  lastUpdated: any;
  approved: boolean;
  pubId: string;
  price: number;
  recommended: boolean;
  serialNo?: number;
}
