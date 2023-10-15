'use client';

import { Button } from '@mui/material';
import Link from 'next/link';

export default function NewTagButton() {
  return (
    <>
      <Link href="/admin/create-tag">
        <Button variant="contained" sx={{ mb: 1 }}>
          Add New Tag
        </Button>
      </Link>
    </>
  );
}
