import { ThemePreference } from '@/gql';
import { useSelector } from '@/store';
import {
  unstable_createMuiStrictModeTheme as createTheme,
  Theme,
  ThemeProvider as OriginalThemeProvider,
  useMediaQuery,
} from '@material-ui/core';
import { FC } from 'react';

const theme = (preference: 'light' | 'dark'): Theme => {
  return createTheme({
    palette: {
      primary: {
        main: '#E63946',
      },
      secondary: {
        main: '#1D3557',
      },
      type: preference,
    },
  });
};

const ThemeProvider: FC = props => {
  const isDark = useMediaQuery('(prefers-color-scheme: dark)');
  const choice = useSelector(state => state.app.theme);
  const preference =
    (choice === ThemePreference.System && isDark) ||
    choice === ThemePreference.Dark
      ? 'dark'
      : 'light';

  return (
    <OriginalThemeProvider theme={{ ...theme(preference) }}>
      {props.children}
    </OriginalThemeProvider>
  );
};

export default ThemeProvider;
