import { PartialThemeVariables } from '@alyle/ui';
import { Color } from './color';

export class AlyleLightThemeVariables implements PartialThemeVariables {
  name = 'minima-light';
  primary = {
    default: Color.primary(),
    contrast: Color.white(),
  };
  accent = {
    default: Color.accent(),
    contrast: Color.white(),
  };
}
