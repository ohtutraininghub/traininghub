'use client';

import { Box, Autocomplete, TextField, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Key, useCallback, useState } from 'react';
import { CourseWithTagsAndStudentCount } from '@/lib/prisma/courses';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

type CourseFilterProps = {
  initialCourses: CourseWithTagsAndStudentCount[];
  initialTags: any;
};

export default function CourseFilter({
  initialCourses,
  initialTags,
}: CourseFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { palette } = useTheme();

  const [filteredCourses, setFilteredCourses] = useState<
    CourseWithTagsAndStudentCount[]
  >([]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const handleNameChange = async (value: string | null) => {
    setFilteredCourses([]);
    const searchTerm: string | null = value;
    if (searchTerm === null) return;
    const filteredCourse = initialCourses.filter((course) =>
      course.name.toLowerCase().includes(searchTerm.toLocaleLowerCase())
    );
    const courseId = filteredCourse[0].id;
    router.push(pathname + '?' + createQueryString('courseId', courseId));
  };

  const handleTagChange = async (tagName: string | null) => {
    if (tagName === null) return;
    const filteredCourses = initialCourses.filter((course: any) =>
      course.tags.some((tag: { name: string }) =>
        tag.name.toLowerCase().includes(tagName.toLowerCase())
      )
    );
    setFilteredCourses(filteredCourses);
  };

  return (
    <>
      <Box
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '16px',
          backgroundColor: palette.white.main,
        }}
      >
        <Autocomplete
          disablePortal
          data-testid="search-autocomplete"
          id="combo-box"
          options={initialCourses.map((course) => course.name)}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Search by a name" />
          )}
          onChange={(event, value) => handleNameChange(value)}
        />
      </Box>
      <Box
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '6px',
          backgroundColor: palette.white.main,
        }}
      >
        {initialTags.map((tag: { id: Key | null | undefined; name: any }) => (
          <Button
            data-testid="search-tags"
            key={tag.id}
            variant="contained"
            onClick={() => handleTagChange(tag.name)}
            style={{ marginRight: '10px', marginBottom: '10px' }}
          >
            {tag.name}
          </Button>
        ))}
      </Box>
      <Box
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '6px',
          backgroundColor: palette.white.main,
        }}
      >
        {filteredCourses.map(
          (tag: { id: Key | null | undefined; name: any }) => (
            <Button
              data-testid="tagButton"
              key={tag.id}
              onClick={() => handleNameChange(tag.name)}
              style={{ marginRight: '10px', marginBottom: '10px' }}
            >
              {tag.name}
            </Button>
          )
        )}
      </Box>
    </>
  );
}
