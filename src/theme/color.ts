import { color } from "@alyle/ui/color";


export class Color {
  static readonly primaryHex = '#6f42c1';
  static primary() {
    return  color(0x6f42c1);
  }
  static accent() {
   return  color(0xfd7e14);
  }

  static white() {
    return color(0xffffff);
  }
}