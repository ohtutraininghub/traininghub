import { ReactNode } from 'react';

interface BackgroundContainerProps {
  children: ReactNode;
}

export default function BackgroundContainer({
  children,
}: BackgroundContainerProps) {
  return (
    <div
      style={{
        backgroundColor: '#00607e',
        height: '100vh',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0px 16px 100px 16px',
          backgroundImage: 'url("/navbar-wave-s.svg")',
          backgroundPosition: 'top',
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#00607e',
        }}
      >
        {children}
      </div>
    </div>
  );
}
