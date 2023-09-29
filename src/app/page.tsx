import { Box, Typography } from '@mui/material';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import CourseForm from '@/components/CourseForm/CourseForm';
import CourseList from '@/components/CourseList/CourseList';

export default async function HomePage() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        pb: 20,
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
      </Box>
      <DeviceHubIcon fontSize="small" />
      <h1>Add new Course</h1>
      <CourseForm />
      <CourseList />
    </Box>
  );
}
