import type { Metadata } from 'next';
import { ThemeRegistry } from '@/components/ThemeRegistry/ThemeRegistry';
import { Inter } from 'next/font/google';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Locale } from '@/lib/i18n/i18n-config';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TrainingHub',
  description: 'Application for training courses',
};

interface Props {
  children: React.ReactNode;
  params: {
    lang: Locale;
  };
}

export default function RootLayout({ children, params: { lang } }: Props) {
  return (
    <html>
      <ThemeRegistry options={{ key: 'mui' }}>
        <body className={inter.className}>
          {' '}
          <Navbar lang={lang} />
          {children}
        </body>
      </ThemeRegistry>
    </html>
  );
}
