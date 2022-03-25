import { Timestamp } from "@angular/fire/firestore";

export interface INotification {
  message: string;
  title: string;
  isRead: boolean;
  sentDateTime: Timestamp;
  docId?: string;
}
