import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import CourseForm from '@/components/CourseForm/CourseForm';
import CourseList from '@/components/CourseList/CourseList';

export default async function HomePage() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0px 16px 100px 16px',
      }}
    >
      <DeviceHubIcon fontSize="small" />
      <h2>Add new Course</h2>
      <CourseForm />
      <CourseList />
    </div>
  );
}
