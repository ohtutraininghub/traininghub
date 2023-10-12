import { ThemeRegistry } from '@/components/Providers/ThemeRegistry';
import NotificationProvider from './MessageProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeRegistry options={{ key: 'mui' }}>
      <NotificationProvider>{children}</NotificationProvider>
    </ThemeRegistry>
  );
}
