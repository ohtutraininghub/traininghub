import { Box, Typography } from '@mui/material';
import Navbar from '@/components/Navbar';

export default async function HomePage() {
  return (
    <main
      style={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Typography>List of trainings here...</Typography>
    </main>
  );
}
