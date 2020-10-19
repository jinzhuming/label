import React, { useContext, useEffect } from 'react';
import { ThemeProvider } from 'emotion-theming';
import { theme } from '@/theme';
import { fromEvent } from 'rxjs';

export default ({ children }: { children: React.ReactNode }) => {
  // 禁止右键点开菜单
  useEffect(() => {
    const showContextmenu$ = fromEvent(window, 'contextmenu').subscribe((e) => {
      // e.preventDefault();
    });
    return () => {
      showContextmenu$.unsubscribe();
    };
  }, []);
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
