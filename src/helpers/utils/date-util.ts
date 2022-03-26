import { Timestamp } from '@angular/fire/firestore';
import { DateTime } from 'luxon';

export class DateUtil {

  static getLocalDateTime(timestamp: Timestamp) {
    const timeInMillis = DateUtil.getMilliseconds(timestamp);
    return DateTime.fromMillis(timeInMillis);
  }
    
  static diffFromNow(dateTime: DateTime, durationUnit:'days'|'day') {
    return dateTime.diffNow(durationUnit);
  }

  static getLocalDateTimeNow() {
    return DateTime.now();
  }

  private static getMilliseconds(timestamp: Timestamp) {
    return timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;
  }
}
