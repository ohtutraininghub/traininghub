import { List } from '@/components/List';
import { GET as getProfiles } from './api/profile/route';
import { Box, Typography } from '@mui/material';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import { prisma } from '@/lib/prisma';
import CourseForm from '@/components/CourseForm/CourseForm';

export default async function HomePage() {
  const data = await getProfiles();
  const dataAsJson = await data.json();

  const users = await prisma.user.findMany();

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
      </Typography>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Typography color="primary.main">Primary color</Typography>
        <Typography color="secondary.main">Secondary color</Typography>
        <Typography color="info.main">Info</Typography>
        <Typography color="darkBlue.main">Dark blue</Typography>
        <Typography color="black.main">Black</Typography>
        <Typography sx={{ backgroundColor: 'info.main' }} color="white.main">
          White
        </Typography>
        {users.map((user) => (
          <Box key={user.id}>
            <p>{user.name}</p>
            <p>{user.email}</p>
          </Box>
        ))}
      </Box>
      <DeviceHubIcon fontSize="small" />
      <List
        data={[
          { header: 'List header', description: JSON.stringify(dataAsJson) },
          { header: 'Random header', description: 'Random description' },
        ]}
      />

      <h1>Add new Course</h1>
      <CourseForm />
    </Box>
  );
}
