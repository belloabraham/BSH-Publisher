import { Timestamp } from "@angular/fire/firestore";
import { IDocId } from "../idoc-id";

export interface INotification extends IDocId {
  message: string;
  title: string;
  isRead: boolean;
  sentDateTime: Timestamp;
  docId?: string;
}
