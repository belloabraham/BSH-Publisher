import { Notify } from 'notiflix/build/notiflix-notify-aio';

export class Notification {
  isClickToClose = true;
  isBackOverlay = true;
  isPlainText = true;
  position?:
    | 'right-top'
    | 'right-bottom'
    | 'left-top'
    | 'left-bottom'
    | 'center-top'
    | 'center-bottom'
    | 'center-center';
  timeOut = 3000;
  messageMaxLenght = 110;

  static readonly SHORT_LENGHT=1000

  constructor() {}

  error(
    msg: string,
    callback?: () => void,
    options: Notiflix.INotifyOptions = {
      position: this.position,
      plainText: this.isPlainText,
      backOverlay: this.isBackOverlay,
      clickToClose: this.isClickToClose,
      messageMaxLength: this.messageMaxLenght,
      timeout: this.timeOut,
      cssAnimationStyle: 'from-top',
    }
  ) {
    Notify.failure(msg, callback, options);
  }

  success(
    msg: string,
    callback?: () => void,
    options: Notiflix.INotifyOptions = {
      position: this.position,
      plainText: this.isPlainText,
      backOverlay: this.isBackOverlay,
      clickToClose: this.isClickToClose,
      messageMaxLength: this.messageMaxLenght,
      timeout: this.timeOut,
      cssAnimationStyle: 'from-top',
    }
  ) {
    Notify.success(msg, callback, options);
  }
}
