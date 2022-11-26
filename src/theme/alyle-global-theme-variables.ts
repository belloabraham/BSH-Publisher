import { lyl, PartialThemeVariables } from "@alyle/ui";
import { Display } from "src/helpers/utils/display";

export class AlyleGlobalThemeVariables implements PartialThemeVariables {
  button = {
    root: () => lyl`{
      font-size: 1rem
    }`,
  };

  typography = {
    fontFamily: `Source Sans Pro`,
    fontSize: Display.remToPixel(1),
  };
}