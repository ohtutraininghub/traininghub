import {
  PaletteColor,
  PaletteColorOptions,
  createTheme,
  responsiveFontSizes,
} from '@mui/material/styles';

declare module '@mui/material/styles' {
  // Types for new additional colors
  // eslint-disable-next-line no-unused-vars
  interface Palette {
    tertiary: PaletteColor;
    surface: PaletteColor;
    coverBlue: PaletteColor;
    black: PaletteColor;
    white: PaletteColor;
    modal: PaletteColor;
    success: PaletteColor;
  }
  // eslint-disable-next-line no-unused-vars
  interface PaletteOptions {
    tertiary?: PaletteColorOptions;
    surface?: PaletteColorOptions;
    coverBlue?: PaletteColorOptions;
    black?: PaletteColorOptions;
    white?: PaletteColorOptions;
    modal?: PaletteColorOptions;
    success?: PaletteColorOptions;
  }
}

let theme = createTheme({
  // overrides the default MUI color palette: (https://mui.com/material-ui/customization/palette/)
  palette: {
    primary: {
      main: '#ffd100', // vibrant yellow
      light: '#ffe62b',
      dark: '#ffb500',
    },
    secondary: {
      main: '#003e51', // deep teal
      light: '#006699',
      dark: '#002943',
      contrastText: '#fff',
    },
    tertiary: {
      main: '#800020', // deep burgundy
      light: '#cc3333',
      dark: '#590013',
      contrastText: '#fff',
    },
    surface: {
      main: '#e5e1dc', // grey
      light: '#f6f4f2',
      dark: '#999999',
    },
    coverBlue: {
      // bundled soothing tone set for large surfaces
      main: '#00607e', // contrast for navbar wave
      light: '#0081aa', // used for navbar and wave
      dark: '#002b3a', // used for elevated surfaces in connection with main and light
      contrastText: '#fff',
    },
    info: {
      main: '#007fa3', // light blue
      light: '#33acd8',
      dark: '#005872',
    },
    black: {
      main: '#1f1e1e',
    },
    white: {
      main: '#ffffff',
    },
    modal: { main: '#000000bf' },
    success: {
      main: '#4caf50',
      light: '#66bb6a',
      dark: '#388e3c',
      contrastText: '#f6f4f2',
    },
  },
  typography: {
    htmlFontSize: 16, // root
    h1: {
      fontSize: '3rem', // 3 * 16 = 48
      fontWeight: 400,
      lineHeight: 1.167,
      letterSpacing: '0em',
    },
    h2: {
      fontSize: '2.125rem', // 2.125 * 16 = 34
      fontWeight: 400,
      lineHeight: 1.235,
      letterSpacing: '0.00735em',
    },
    h3: {
      fontSize: '1.5rem', // 1.5 * 16 = 24
      fontWeight: 400,
      lineHeight: 1.167,
      letterSpacing: '0em',
    },
    h4: {
      fontSize: '1.25rem', // 1.25 * 26 = 20
      fontWeight: 500,
      lineHeight: 1.6,
      letterSpacing: '0.0075em',
    },
    h5: {
      fontSize: '1.125rem', // 1.125 * 16 = 18
      fontWeight: 500,
      lineHeight: 1.6,
      letterSpacing: '0.0075em',
    },
    h6: {
      fontSize: '1.075rem', // 1.075 * 16 = 17.2
      fontWeight: 500,
      lineHeight: 1.6,
      letterSpacing: '0.0075em',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          color: '#ffffff',
          backgroundColor: '#0081aa',
          height: 65,
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
