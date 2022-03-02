import { Block } from "notiflix";

export class Shield {
  private static readonly shield = '.shield';

  static standard(selector: string = Shield.shield, message?: string) {
    Block.standard(selector, message);
  }

  static remove(selector: string = Shield.shield) {
    Block.remove(selector);
  }
}