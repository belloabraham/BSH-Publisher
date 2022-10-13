
import { Confirm, Report } from 'notiflix';

export class AlertDialog {
  static warn(
    msg: string,
    title: string,
    yesText: string,
    noText: string,
    yesCallBack?: () => void | undefined,
    noCallBack?: () => void | undefined,
    options: Notiflix.IConfirmOptions | undefined = {
      titleColor: '#320066',
      okButtonBackground: '#320066',
      messageMaxLength: 200,
    }
  ) {
    Confirm.show(title, msg, yesText, noText, yesCallBack, noCallBack, options);
  }

  static success(
    msg: string,
    title: string,
    btnTxt: string,
    callBackOrOption?: Notiflix.IReportOptions | (() => void) | undefined,
    options?: Notiflix.IReportOptions | undefined
  ) {
    Report.success(title, msg, btnTxt, callBackOrOption, options);
  }

  static error(
    msg: string,
    title: string,
    btnTxt: string,
    callBackOrOption?: Notiflix.IReportOptions | (() => void) | undefined,
    options?: Notiflix.IReportOptions | undefined
  ) {
    Report.failure(title, msg, btnTxt, callBackOrOption, options);
  }
}
