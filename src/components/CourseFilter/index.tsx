'use client';

import {
  IconButton,
  InputBase,
  Paper,
  Select,
  MenuItem,
  SelectChangeEvent,
  Box,
  Typography,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { useTheme } from '@mui/material/styles';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Course, Prisma } from '@prisma/client';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CourseList from '../CourseList/CourseList';
import { DatePicker } from '@mui/x-date-pickers';

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
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    try {
      setFilteredCourses(initialCourses);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [initialCourses]);

  const handleNameChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
    const filteredCourses = initialCourses.filter((course) =>
      course.name.toLowerCase().includes(searchTerm.toLocaleLowerCase())
    );
    setFilteredCourses(filteredCourses);
  };

  const handleTagChange = async (event: SelectChangeEvent<string>) => {
    const selectedTag = event.target.value;
    const filteredCourses =
      selectedTag === 'all tags'
        ? initialCourses
        : initialCourses.filter((course: any) =>
            course.tags.some((tag: { name: string }) =>
              tag.name.toLowerCase().includes(selectedTag.toLowerCase())
            )
          );
    setFilteredCourses(filteredCourses);
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    const filteredCourses = date
      ? initialCourses.filter(
          (course) =>
            new Date(course.startDate) <= date &&
            date <= new Date(course.endDate)
        )
      : initialCourses;
    setFilteredCourses(filteredCourses);
  };

  const handleClearSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchTerm('');
    setFilteredCourses(initialCourses);
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
        <Paper
          component="form"
          elevation={10}
          sx={{
            backgroundColor: palette.secondary.main,
            display: 'flex',
            alignItems: 'center',
            padding: '10px',
            marginRight: '1rem',
          }}
          onSubmit={handleClearSubmit}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search by a course name"
            inputProps={{ 'aria-label': 'search' }}
            value={searchTerm}
            onChange={handleNameChange}
          />
          <IconButton type="submit">
            <ClearIcon />
          </IconButton>
        </Paper>
        <Typography variant="body2" style={{ marginBottom: '5px' }}>
          or by a tag
        </Typography>
        <Select
          value={''}
          onChange={handleTagChange}
          variant="outlined"
          sx={{
            minWidth: 120,
            marginLeft: '1rem',
            marginRight: '1rem',
            boxShadow: 10,
            backgroundColor: palette.secondary.main,
          }}
        >
          <MenuItem value="all tags">All Tags</MenuItem>
          {initialTags.map((tag) => (
            <MenuItem key={tag.id} value={tag.name}>
              {tag.name}
            </MenuItem>
          ))}
        </Select>
        <Typography variant="body2" style={{ marginBottom: '5px' }}>
          or by a date
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            sx={{
              backgroundColor: palette.secondary.main,
              boxShadow: 10,
              marginLeft: '1rem',
            }}
            value={selectedDate}
            onChange={handleDateChange}
          />
        </LocalizationProvider>
      </Box>
      <CourseList courses={filteredCourses} />
    </>
  );
}
