import { lyl, PartialThemeVariables } from "@alyle/ui";
import { Display } from "src/helpers/utils/display";

export class AlyleGlobalThemeVariables implements PartialThemeVariables {
  button = {
    root: () => lyl`{
      font-size: 1.2rem
    }`,
  };

  typography = {
    fontFamily: `Stickler`,
    fontSize: Display.remToPixel(1.2),
  };
}