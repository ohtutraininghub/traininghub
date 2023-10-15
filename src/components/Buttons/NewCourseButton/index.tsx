'use client';

import { Button, Typography } from '@mui/material';
import Link from 'next/link';

export default function NewCourseButton() {
  return (
    <>
      <Typography variant="h4">Actions</Typography>
      <Link href="/courses/create">
        <Button variant="contained" sx={{ m: 1 }}>
          Add New Course
        </Button>
      </Link>
    </>
  );
}
