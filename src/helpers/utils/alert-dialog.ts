
import { Confirm, Report } from 'notiflix';

export class AlertDialog {

  static warn(
    msg: string,
    title: string,
    yesText: string,
    noText: string,
    yesCallBack?: any | undefined,
    noCallBack?: any | undefined,
    options: Notiflix.IConfirmOptions | undefined = {
      titleColor: '#320066',
      okButtonBackground: '#320066',
    }
  ) {
    Confirm.show(title, msg, yesText, noText, yesCallBack, noCallBack, options);
  }

  static success(
    msg: string,
    title: string,
    btnTxt: string,
    callBackOrOption?: any | undefined,
    options?: Notiflix.IReportOptions | undefined
  ) {
    Report.success(title, msg, btnTxt, callBackOrOption, options);
  }

  static error(
    msg: string,
    title: string,
    btnTxt: string,
    callBackOrOption?: any | undefined,
    options?: Notiflix.IReportOptions | undefined
  ) {
    Report.failure(title, msg, btnTxt, callBackOrOption, options);
  }


}
