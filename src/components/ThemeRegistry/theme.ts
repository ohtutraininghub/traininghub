import {
  PaletteColor,
  PaletteColorOptions,
  createTheme,
} from '@mui/material/styles';

declare module '@mui/material/styles' {
  // Types for new additional colors
  // eslint-disable-next-line no-unused-vars
  interface Palette {
    darkBlue: PaletteColor;
    black: PaletteColor;
    white: PaletteColor;
  }
  // eslint-disable-next-line no-unused-vars
  interface PaletteOptions {
    darkBlue?: PaletteColorOptions;
    black?: PaletteColorOptions;
    white?: PaletteColorOptions;
  }
}

const theme = createTheme({
  // overrides the default MUI color palette: (https://mui.com/material-ui/customization/palette/)
  palette: {
    primary: {
      main: '#ffd100', // yellow
    },
    secondary: {
      main: '#e5e1dc', // grey
    },
    info: {
      main: '#007fa3', // light blue
    },
    darkBlue: {
      main: '#003e51',
    },
    black: {
      main: '#1f1e1e',
    },
    white: {
      main: '#ffffff',
    },
  },
});

export default theme;
