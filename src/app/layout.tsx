import type { Metadata } from 'next';
import { ThemeRegistry } from '@/components/ThemeRegistry/ThemeRegistry';
import { Inter } from 'next/font/google';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import AuthProvider from '@/components/AuthProvider/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TrainingHub',
  description: 'Application for training courses',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <AuthProvider>
        <ThemeRegistry options={{ key: 'mui' }}>
          <body className={inter.className}>{children}</body>
        </ThemeRegistry>
      </AuthProvider>
    </html>
  );
}
