import { Block } from "notiflix";
import { Config } from "src/data/config";
import { Display } from "./display";

export class Shield {
  private static readonly shield = '.shield';

  static standard(selector: string = Shield.shield, message?: string) {
    Block.standard(selector, message, {
      fontFamily: Config.defaultFontFamily,
      svgSize: `${Display.remToPixel(3.75)}px`,
    });
  }

  static remove(selector: string | HTMLElement[] = Shield.shield) {
    Block.remove(selector);
  }

  static pulse(
    selector: string | HTMLElement[],
    message?: string,
    fontSizeInRem: number = 1.2
  ) {
    Block.pulse(selector, message, {
      fontFamily: Config.defaultFontFamily,
      svgSize: `${Display.remToPixel(3.75)}px`,
      messageFontSize: `${Display.remToPixel(fontSizeInRem)}px`,
      messageMaxLength: 200,
    });
  }
}