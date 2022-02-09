import { Timestamp } from '@angular/fire/firestore';

export class DateTime {
  
  static getLocalDateTime(timestamp: any) {
    if (timestamp) {
      let time = timestamp as Timestamp;
      return new Date(
        time.seconds * 1000 + time.nanoseconds / 1000000
      ).toLocaleString();
    } else {
      return null;
    }
  }

  static getLocaleDate(timestamp: any) {
    if (timestamp) {
      let time = timestamp as Timestamp;
      return new Date(
        time.seconds * 1000 + time.nanoseconds / 1000000
      ).toLocaleDateString();
    } else {
      return null;
    }
  }
}
