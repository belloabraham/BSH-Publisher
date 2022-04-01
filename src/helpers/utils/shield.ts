import { Block } from "notiflix";
import { Config } from "src/domain/data/config";

export class Shield {
  private static readonly shield = '.shield';

  static standard(selector: string = Shield.shield, message?: string) {
    Block.standard(selector, message, {
      fontFamily: Config.defaultFontFamily,
      svgSize: '60px'
    });
  }

  static remove(selector: string = Shield.shield) {
    Block.remove(selector);
  }

  static pulse(selector: string, fontSize:number, message?: string) {
     Block.pulse(selector, message, {
       fontFamily: Config.defaultFontFamily,
       svgSize: '60px',
       messageFontSize: `${fontSize}px`,
       messageMaxLength: 200
     });
  }

}