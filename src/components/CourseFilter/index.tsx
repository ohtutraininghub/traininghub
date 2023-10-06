'use client';

import { Divider, IconButton, InputBase, Paper } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { useTheme } from '@mui/material/styles';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Course } from '@prisma/client';
import CourseList from '../CourseList/CourseList';

export default function CourseFilter() {
  const { palette } = useTheme();

  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/course');
      const result = await response.json();
      setCourses(result.data);
      setFilteredCourses(result.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
            placeholder="Search by a tag or a name"
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
      <CourseList courses={filteredCourses} />
    </>
  );
}
