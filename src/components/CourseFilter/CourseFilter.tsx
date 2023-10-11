'use client';

import {
  IconButton,
  InputBase,
  Paper,
  Select,
  MenuItem,
  SelectChangeEvent,
  Box,
  InputLabel,
  FormControl,
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
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

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
    setStartDate(null);
    setEndDate(null);
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
    setSearchTerm('');
    setStartDate(null);
    setEndDate(null);
  };

  const handleDateChange = async (date: Date | null) => {
    setEndDate(date);
    const compStart = startDate !== null ? new Date(startDate) : null;
    const compDate = date !== null ? new Date(date) : null;
    compStart !== null && compDate !== null && compStart > compDate
      ? setStartDate(date)
      : null;

    const filteredCourses = date
      ? initialCourses.filter((course) => {
          const courseStartDate = new Date(course.startDate);
          courseStartDate.setHours(0, 0, 0, 0);
          const courseEndDate = new Date(course.endDate);
          courseEndDate.setHours(0, 0, 0, 0);
          const selectedDate = new Date(date);
          selectedDate.setHours(0, 0, 0, 0);
          return (
            courseStartDate <= selectedDate && selectedDate <= courseEndDate
          );
        })
      : initialCourses;
    setFilteredCourses(filteredCourses);
    setSearchTerm('');
  };

  const handleClearSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchTerm('');
    setFilteredCourses(initialCourses);
    setStartDate(null);
    setEndDate(null);
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
            data-testid="search-paper"
          />
          <IconButton type="submit">
            <ClearIcon />
          </IconButton>
        </Paper>
        <FormControl>
          <InputLabel
            style={{
              textAlign: 'center',
              alignItems: 'center',
              marginLeft: '1rem',
            }}
          >
            <Typography variant="body1">Search by a tag</Typography>
          </InputLabel>
          <Select
            value=""
            onChange={handleTagChange}
            variant="outlined"
            sx={{
              minWidth: 200,
              marginLeft: '1rem',
              marginRight: '1rem',
              boxShadow: 10,
              backgroundColor: palette.secondary.main,
            }}
            data-testid="tag-select"
          >
            <MenuItem value="all tags">All Tags</MenuItem>
            {initialTags.map((tag) => (
              <MenuItem key={tag.id} value={tag.name}>
                {tag.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            disablePast
            sx={{
              backgroundColor: palette.secondary.main,
              boxShadow: 10,
              marginLeft: '1rem',
            }}
            label="Start Date"
            value={startDate}
            onChange={(date) => {
              setStartDate(date);
              handleDateChange(date);
            }}
            data-testid="start-date-picker"
          />
          <DatePicker
            disablePast
            sx={{
              backgroundColor: palette.secondary.main,
              boxShadow: 10,
              marginLeft: '1rem',
            }}
            label="End Date"
            value={endDate}
            onChange={(date) => {
              setEndDate(date);
              handleDateChange(date);
            }}
            data-testid="end-date-picker"
          />
        </LocalizationProvider>
      </Box>
      <CourseList courses={filteredCourses} />
    </>
  );
}
