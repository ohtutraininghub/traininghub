import theme from '@/components/Providers/ThemeRegistry/theme';
import { ThemeProvider } from '@mui/material/styles';
import { render } from '@testing-library/react';

export const renderWithTheme = (children: React.ReactNode) => {
  return render(<ThemeProvider theme={theme}>{children}</ThemeProvider>);
};

// Magic lines in tests
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function renderAsyncComponent(Component: any, props?: any) {
  const ComponentResolved = await Component(props);
  return renderWithTheme(ComponentResolved);
}
