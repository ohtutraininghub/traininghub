'use client';

import { Button } from '@mui/material';
import Link from 'next/link';

export default function NewCourseButton() {
  return (
    <>
      <Link href="/courses/create">
        <Button variant="contained">Add New Course</Button>
      </Link>
    </>
  );
}
