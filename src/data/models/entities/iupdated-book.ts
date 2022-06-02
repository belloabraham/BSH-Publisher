export interface IUpdatedBook {
  name: string;
  author: string;
  description: string;
  category: string;
  tag: string | undefined;
  lastUpdated: any;
  price: number;
  approved: boolean;
}
