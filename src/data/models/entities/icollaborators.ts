export interface ICollaborators {
  collabName: string;
  collabId: string | null;
  bookName: string;
  dateCreated?: any;
  pubName: string;
  bookId: string;
  collabCommissionInPercent: number;
  link: string | null;
  collabEmail: string;
  totalEarningsInNGN: number;
  totalEarningsInUSD: number;
}
