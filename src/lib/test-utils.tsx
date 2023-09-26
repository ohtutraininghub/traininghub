import theme from '@/components/ThemeRegistry/theme';
import { ThemeProvider } from '@mui/material/styles';
import { render } from '@testing-library/react';

export const renderWithTheme = (children: React.ReactNode) => {
  return render(<ThemeProvider theme={theme}>{children}</ThemeProvider>);
};
