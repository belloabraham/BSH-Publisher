
import { Confirm, Report } from 'notiflix';
import { Color } from 'src/theme/color';

export class AlertDialog {

  static warn(
    msg: string,
    title: string,
    yesText: string,
    noText: string,
    yesCallBack?: () => void | undefined,
    noCallBack?: () => void | undefined,
  ) {
    const color = Color.primary().css();
    Confirm.show(title, msg, yesText, noText, yesCallBack, noCallBack, {
      titleColor: color,
      okButtonBackground: color,
      messageMaxLength: 200,
    });
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

  static prompt(
    defaultValue: string, title: string, msg: string,
    yesText: string, noText: string,
    yesCallBack?: (answer: string) => void, noCallBack?: (answer: string) => void) {
    const color = Color.primary().css();
    Confirm.prompt(
      title,
      msg,
      defaultValue,
      yesText,
      noText,
      yesCallBack,
      noCallBack, {
        okButtonBackground: color,
        titleColor: color,
      }
    );
  }

}
