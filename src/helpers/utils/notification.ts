import { Notify } from 'notiflix/build/notiflix-notify-aio';

export class Notification {
  
    //*Builder Pattern for this Notification

  static error(
    msg: string,
    callback?: () => void,
    options: Notiflix.INotifyOptions = {
      position: 'center-top',
      plainText: false,
      backOverlay: true,
      clickToClose: true,
      pauseOnHover: true,
      cssAnimationStyle: 'from-top',
    }
  ) {
    Notify.failure(msg, callback, options);
  }

  static success(
    msg: string,
    callback?: () => void,
    options: Notiflix.INotifyOptions = {
      position: 'center-top',
      plainText: false,
      backOverlay: true,
      clickToClose: true,
      pauseOnHover: true,
      cssAnimationStyle: 'from-top',
    }
  ) {
    Notify.success(msg, callback, options);
  }
}
