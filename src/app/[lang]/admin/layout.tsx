import Container from '@mui/material/Container';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container maxWidth="md" style={{ paddingTop: '32px' }}>
      {children}
    </Container>
  );
}
