import React, { useEffect } from 'react';
import { ThemeProvider } from '@emotion/react';
import { fromEvent } from 'rxjs';
import theme from '@/theme';

export default ({ children }: { children: React.ReactNode }) => {
  // 禁止右键点开菜单
  useEffect(() => {
    const showContextmenu$ = fromEvent(window, 'contextmenu').subscribe(() => {
      // e.preventDefault();
    });
    return () => {
      showContextmenu$.unsubscribe();
    };
  }, []);
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
