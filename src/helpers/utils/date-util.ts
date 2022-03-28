import { Timestamp } from '@angular/fire/firestore';
import { DateTime } from 'luxon';

export class DateUtil {

  static getLocalDateTime(timestamp: Timestamp) {
    const timeInMillis = DateUtil.getMilliseconds(timestamp);
    return DateTime.fromMillis(timeInMillis);
  }

  static getHumanReadbleDateTime(dateTime:DateTime) {
    return dateTime.toLocaleString(DateTime.DATETIME_MED);
  }
    
  static diffFromNow(dateTime: DateTime, durationUnit:'days'|'day') {
    return dateTime.diffNow(durationUnit);
  }

  private static getMilliseconds(timestamp: Timestamp) {
    return timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;
  }
}
