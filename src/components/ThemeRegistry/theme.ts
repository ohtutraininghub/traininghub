import { createTheme } from '@mui/material/styles'

declare module '@mui/material/styles' {
  // Types for new additional colors
  interface Theme {
    colorPalette: {
      darkBlue: string
      black: string
      white: string
    }
  }
  interface ThemeOptions {
    colorPalette?: {
      darkBlue?: string
      black?: string
      white?: string
    }
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
  },
  // additional colors
  colorPalette: {
    darkBlue: '#003e51',
    black: '#1f1e1e',
    white: '#ffffff',
  },
})

export default theme
