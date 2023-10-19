import EnrollButton from './EnrollButton';
import CancelEnroll from './CancelEnroll';
import Typography from '@mui/material/Typography';

type Props = {
  isUserEnrolled: boolean;
  courseId: string;
  isCourseFull: boolean;
};

export default function EnrollHolder({
  isUserEnrolled,
  courseId,
  isCourseFull,
}: Props) {
  if (isUserEnrolled) {
    return (
      <>
        <Typography>You have enrolled for this course!</Typography>
        <CancelEnroll courseId={courseId} />
      </>
    );
  }

  if (isCourseFull) {
    return null;
  }

  return <EnrollButton courseId={courseId}></EnrollButton>;
}
