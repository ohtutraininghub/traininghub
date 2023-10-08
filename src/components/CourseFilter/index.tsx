'use client';

import { Button, Divider, IconButton, InputBase, Paper } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { useTheme } from '@mui/material/styles';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Course, Prisma, Tag } from '@prisma/client';
import CourseList from '../CourseList/CourseList';

type CoursePrismaType = Prisma.CourseGetPayload<Prisma.CourseDefaultArgs>;
type TagPrismaType = Prisma.TagGetPayload<Prisma.TagDefaultArgs>;

type CourseFilterProps = {
  courses: CoursePrismaType[];
  tags: TagPrismaType[];
};

export default function CourseFilter({
  courses: initialCourses,
  tags: initialTags,
}: CourseFilterProps) {
  const { palette } = useTheme();

  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  const fetchData = async () => {
    try {
      setCourses(initialCourses);
      setTags(initialTags);
      setFilteredCourses(initialCourses);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [initialCourses]);

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);

    const filteredCourses = courses.filter((course: { name: string }) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(filteredCourses);
  };

  const handleClearSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchTerm('');
    setFilteredCourses(courses);
  };

  return (
    <>
      <div>
        <Paper
          component="form"
          elevation={10}
          sx={{
            backgroundColor: palette.secondary.main,
            display: 'flex',
            alignItems: 'center',
            padding: '20px',
          }}
          onSubmit={handleClearSubmit}
        >
          <InputBase
            sx={{ ml: 5, flex: 1 }}
            placeholder="Search by a course name"
            inputProps={{ 'aria-label': 'search' }}
            value={searchTerm}
            onChange={handleChange}
          />
          <Divider sx={{ height: 28, mx: 0.5 }} orientation="vertical" />
          <IconButton type="submit">
            <ClearIcon />
          </IconButton>
        </Paper>
      </div>
      <h2>or by a tag</h2>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {tags.map((tag) => (
          <Button
            key={tag.id}
            sx={{
              color: palette.secondary.main,
              backgroundColor: palette.darkBlue.main,
              '&:hover': {
                backgroundColor: palette.info.main,
              },
              margin: '0.5rem',
            }}
          >
            {tag.name}
          </Button>
        ))}
      </div>
      <CourseList courses={filteredCourses} />
    </>
  );
}
