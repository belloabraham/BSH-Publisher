

export class Display {
  static remToPixel(rem: number) {
    try {
      return (
        rem * parseFloat(getComputedStyle(document.documentElement).fontSize)
      );
    } catch (error) {
      return rem * 16;
    }
  }
}
