import { PartialThemeVariables } from '@alyle/ui';
import { color } from '@alyle/ui/color';

export class AlyleLightThemeVariables implements PartialThemeVariables {
  name = 'minima-light';
  primary = {
    default: color(0x6f42c1),
    contrast: color(0xffffff),
  };
  accent = {
    default: color(0xfd7e14),
    contrast: color(0xffffff),
  };
}
