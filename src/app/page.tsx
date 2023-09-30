import { Box, Typography } from '@mui/material';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import CourseForm from '@/components/CourseForm/CourseForm';
import CourseList from '@/components/CourseList/CourseList';

export default async function HomePage() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        pb: 20,
        px: 2,
      }}
    >
      <DeviceHubIcon fontSize="small" />
      <h2>Add new Course</h2>
      <CourseForm />
      <CourseList />
    </Box>
  );
}
