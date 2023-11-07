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
  }
  // eslint-disable-next-line no-unused-vars
  interface PaletteOptions {
    tertiary?: PaletteColorOptions;
    surface?: PaletteColorOptions;
    coverBlue?: PaletteColorOptions;
    black?: PaletteColorOptions;
    white?: PaletteColorOptions;
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
