import theme from '@/theme';
import { CSSInterpolation } from '@emotion/css';

declare module 'react' {
  interface HTMLAttributes<T> extends DOMAttributes<T> {
    css?: CSSInterpolation | ((t: typeof theme) => CSSInterpolation);
  }
}
