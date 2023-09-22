import { List } from '@/components/List';
import { GET as getProfiles } from '@/app/api/profile/route';
import { GET as getUsers } from '@/app/api/users/route';
import { Box, Typography } from '@mui/material';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';

export default async function HomePage() {
  const data = await getProfiles();
  const dataAsJson = await data.json();

  const res = await getUsers();
  const users = await res.json();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography variant="h1" color="primary">
        Hello TrainingHub
      </Typography>{' '}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Typography color="primary.main">Primary color</Typography>
        <Typography color="secondary.main">Secondary color</Typography>
        <Typography color="info.main">Info</Typography>
        <Typography color="darkBlue.main">Dark blue</Typography>
        <Typography color="black.main">Black</Typography>
        <Typography sx={{ backgroundColor: 'info.main' }} color="white.main">
          White
        </Typography>
        <p>{JSON.stringify(users)}</p>
      </Box>
      <DeviceHubIcon fontSize="small" />
      <List
        data={[
          { header: 'List header', description: JSON.stringify(dataAsJson) },
          { header: 'Random header', description: 'Random description' },
        ]}
      />
    </Box>
  );
}
