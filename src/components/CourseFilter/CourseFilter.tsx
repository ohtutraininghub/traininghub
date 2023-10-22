'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Autocomplete,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Key, useCallback } from 'react';
import { CourseWithTagsAndStudentCount } from '@/lib/prisma/courses';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [courseName, setCourseName] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    if (
      searchParams.get('courseName') === null &&
      searchParams.get('courseTag') === null &&
      searchParams.get('courseDates') === null &&
      searchParams.get('courseId') === null
    ) {
      handleClearSearch();
    }
  }, [searchParams]);

  const handleNameChange = async (value: string | null) => {
    const searchTerm: string | null = value;
    setCourseName(searchTerm || '');
    router.push(
      pathname + '?' + createQueryString('courseName', searchTerm || '')
    );
  };

  const handleTagChange = async (tagName: string | null) => {
    const searchTerm: string | null = tagName;
    setSelectedTag(searchTerm || '');
    router.push(
      pathname + '?' + createQueryString('courseTag', searchTerm || '')
    );
  };

  const handleDateChange = async (range: [any, any]) => {
    const [startDate, endDate] = range;
    setStartDate(startDate);
    setEndDate(endDate);
    if (startDate === null && endDate === null) {
      router.push(pathname + '?' + createQueryString('courseDates', ''));
    } else {
      router.push(
        pathname +
          '?' +
          createQueryString('courseDates', startDate + '-' + endDate)
      );
    }
  };

  const handleClearSearch = async () => {
    await handleNameChange(null);
    await handleTagChange('');
    await handleDateChange([null, null]);
    router.replace(pathname);
  };

  const customStyles = {
    width: '250px',
    height: '55px',
    fontSize: '16px',
  };

  return (
    <>
      <Typography variant="h4">Search courses</Typography>
      <Box
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '16px',
          backgroundColor: palette.white.main,
        }}
      >
        <Button
          variant="contained"
          onClick={() => handleClearSearch()}
          sx={{
            width: '200px',
            marginRight: '50px',
            backgroundColor: palette.surface.main,
          }}
        >
          Clear search
        </Button>
        <div>
          <Autocomplete
            value={courseName}
            clearOnEscape
            disablePortal
            data-testid="search-autocomplete"
            id="combo-box"
            options={initialCourses.map((course) => course.name)}
            sx={{ width: '250px', marginRight: '50px' }}
            renderInput={(value) => (
              <TextField {...value} label="Search by a name" />
            )}
            onChange={(event, value) => {
              handleNameChange(value);
            }}
          />
        </div>
        <FormControl>
          <InputLabel>Search by a tag</InputLabel>
          <Select
            value={selectedTag}
            onChange={(event) => handleTagChange(event.target.value as string)}
            sx={{ width: '250px', marginRight: '50px' }}
          >
            <MenuItem value="">-</MenuItem>
            {initialTags.map(
              (tag: { id: Key | null | undefined; name: string }) => (
                <MenuItem key={tag.id} value={tag.name}>
                  {tag.name}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>
        <DatePicker
          fixedHeight
          placeholderText="  Search by dates"
          minDate={new Date()}
          selected={startDate}
          onChange={handleDateChange}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          showWeekNumbers
          isClearable
          highlightDates={initialCourses.map((course) => course.startDate)}
          customInput={<input style={customStyles} />}
        />
      </Box>
    </>
  );
}
