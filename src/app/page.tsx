import { Box, Typography } from '@mui/material';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import CourseForm from '@/components/CourseForm/CourseForm';
import CourseList from '@/components/CourseList/CourseList';

export default async function HomePage() {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        pb: 20,
      }}
    >
      <DeviceHubIcon fontSize="small" />
      <h2>Add new Course</h2>
      <CourseForm />
      <CourseList />
    </Box>
  );
}
