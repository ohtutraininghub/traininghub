import { ThemeRegistry } from '@/components/Providers/ThemeRegistry';
import NotificationProvider from './MessageProvider';
import { SessionProvider } from './SessionProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeRegistry options={{ key: 'mui' }}>
        <NotificationProvider>{children}</NotificationProvider>
      </ThemeRegistry>
    </SessionProvider>
  );
}
