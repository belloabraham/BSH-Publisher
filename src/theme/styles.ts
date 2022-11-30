import { shadowBuilder, ThemeVariables } from '@alyle/ui';

export function shadow(elevation: number = 1) {
  const styles = (theme: ThemeVariables) => ({
    shadow: {
      boxShadow: shadowBuilder(elevation),
    },
    });
    return styles;
}
