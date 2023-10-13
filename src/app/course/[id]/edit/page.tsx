import CourseForm from '@/components/CourseForm/CourseForm';
import { prisma } from '@/lib/prisma';
import { Box, Typography } from '@mui/material';
import { notFound } from 'next/navigation';

type Props = {
  params: {
    id: string;
  };
};

export default async function CourseEditPage({ params }: Props) {
  const courseId = params.id;
  const course = await prisma.course.findFirst({
    where: { id: courseId },
  });

  if (!course) {
    notFound();
  }

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        pb: 10,
      }}
    >
      <Typography variant="h4" sx={{ m: 4, textAlign: 'center' }}>
        Edit Course Details
      </Typography>
      <CourseForm courseData={course} />
    </Box>
  );
}
