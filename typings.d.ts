import { theme } from '@/theme';
import { Interpolation } from '@emotion/css';
declare module '*.css';
declare module '*.less';
declare module '*.png';
declare module '*.svg' {
  export function ReactComponent(
    props: React.SVGProps<SVGSVGElement>,
  ): React.ReactElement;
  const url: string;
  export default url;
}

declare module 'react' {
  interface HTMLAttributes<T> extends DOMAttributes<T> {
    css?: Interpolation | ((t: typeof theme) => Interpolation);
  }
}
declare module 'emotion-theming' {
  export function useTheme(): typeof theme;
}
