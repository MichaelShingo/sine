'use client';

import CssBaseline from '@mui/material/CssBaseline';
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from '@mui/material/styles';
import { createContext, PropsWithChildren, useContext, useMemo } from 'react';
import type {} from '@mui/material/themeCssVarsAugmentation';

const AppThemeContext = createContext(null);

const AppThemeProvider = (props: PropsWithChildren) => {
  const theme = useMemo(() => {
    return responsiveFontSizes(
      createTheme({
        typography: {
          fontFamily: 'var(--font-noto-sans), sans-serif',
          fontWeightLight: 200,
          fontWeightRegular: 300,
          fontWeightMedium: 400,
          fontWeightBold: 600,
          fontSize: 14,
        },
        cssVariables: {
          colorSchemeSelector: 'class',
          disableCssColorScheme: true,
        },
        palette: {
          primary: {
            main: '#ff4e46',
          },
          secondary: {
            main: '#344dc2',
          },
          background: {
            paper: '#ffffff',
            default: '#f0f0f0',
          },
          warning: {
            main: '#ff8549',
          },
          success: {
            main: '#366cd8',
          },
          info: {
            main: '#8b45ff',
          },
          error: {
            main: '#ff4e46',
          },
          divider: '#ffffff1f',
        },
        colorSchemes: {
          light: {
            palette: {
              primary: {
                main: '#ff4e46',
              },
              secondary: {
                main: '#344dc2',
              },
              background: {
                default: '#eae4ff',
                paper: '#5c5cff',
              },
            },
          },
          dark: {
            palette: {
              primary: {
                main: '#ff4e46',
              },
              secondary: {
                main: '#344dc2',
              },
              background: {
                default: '#050113',
                paper: '#02021d',
              },
            },
          },
        },
        spacing: 6,
        shadows: [
          'none',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          '',
        ],
        shape: {
          borderRadius: 24,
        },
      }),
    );
  }, []);

  return (
    <AppThemeContext.Provider value={null}>
      <ThemeProvider
        defaultMode="system"
        theme={theme}
        disableTransitionOnChange
      >
        <CssBaseline enableColorScheme />
        {props.children}
      </ThemeProvider>
    </AppThemeContext.Provider>
  );
};

export const useAppThemeContext = () => useContext(AppThemeContext);
export default AppThemeProvider;
