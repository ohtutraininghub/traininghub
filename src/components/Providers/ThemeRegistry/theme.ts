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
    tetriary: PaletteColor;
    darkBlue: PaletteColor;
    black: PaletteColor;
    white: PaletteColor;
  }
  // eslint-disable-next-line no-unused-vars
  interface PaletteOptions {
    tetriary?: PaletteColorOptions;
    darkBlue?: PaletteColorOptions;
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
      main: '#e5e1dc', // grey
      light: '#f6f4f2',
      dark: '#999999',
    },
    tetriary: {
      // deep burgyndy
      main: '#800020',
      light: '#cc3333',
      dark: '#590013',
    },
    info: {
      main: '#007fa3', // light blue
      light: '#33acd8',
      dark: '#005872',
    },
    darkBlue: {
      main: '#003e51', // deep teal
      light: '#006699',
      dark: '#002943',
    },
    black: {
      main: '#1f1e1e',
    },
    white: {
      main: '#ffffff',
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
