'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Autocomplete,
  TextField,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  ListItemText,
  OutlinedInput,
  Checkbox,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useCallback } from 'react';
import { CourseWithTagsAndStudentCount } from '@/lib/prisma/courses';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useForm } from 'react-hook-form';
import { Tag } from '@prisma/client';

type CourseFilterProps = {
  initialCourses: CourseWithTagsAndStudentCount[];
  initialTags: Tag[];
};

export default function CourseFilter({
  initialCourses,
  initialTags,
}: CourseFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { palette } = useTheme();
  const { control } = useForm();

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [courseName, setCourseName] = useState('');
  const [tagField, setTagField] = useState<string[]>([]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    const { courseName, courseTag, courseDates, courseId } = Object.fromEntries(
      searchParams.entries()
    );
    if (!courseName && !courseTag && !courseDates && !courseId) {
      handleClearSearch();
    }
    if (courseName !== undefined) {
      setCourseName(courseName);
    }
    if (courseTag !== undefined) {
      const parsedTags = courseTag.split(',');
      setTagField(parsedTags);
    }
  }, [searchParams]);

  const handleNameChange = async (value: string | null) => {
    const searchTerm: string | null = value;
    setCourseName(searchTerm || '');
    router.push(
      pathname + '?' + createQueryString('courseName', searchTerm || '')
    );
  };

  const handleTagChange = (
    event: SelectChangeEvent<typeof tagField>,
    tagList: string | string[]
  ) => {
    const {
      target: { value },
    } = event;
    setTagField(typeof value === 'string' ? value.split(',') : value);
    const tagListQueryParam = createQueryString(
      'courseTag',
      tagList.toString()
    );
    router.push(pathname + '?' + tagListQueryParam);
  };

  const handleDateChange = (range: [Date | null, Date | null]) => {
    const [startDate, endDate] = range;
    setStartDate(startDate);
    setEndDate(endDate);

    const dateRangeQueryParam =
      startDate === null && endDate === null
        ? createQueryString('courseDates', '')
        : createQueryString('courseDates', startDate + '-' + endDate);
    router.push(pathname + '?' + dateRangeQueryParam);
  };

  const handleClearSearch = async () => {
    await handleNameChange(null);
    handleDateChange([null, null]);
    setTagField([]);
    control._reset();
    router.replace(pathname);
  };

  const InputStyles = {
    datepicker: {
      width: '250px',
      height: '55px',
      fontSize: '16px',
      paddingLeft: '10px',
      verticalAlign: 'middle',
    },
  };

  return (
    <>
      <Box
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          padding: '16px',
          flexWrap: 'wrap',
          paddingBottom: '10px',
        }}
      >
        <div style={{ marginBottom: '10px' }}>
          <Autocomplete
            value={courseName || null}
            clearOnEscape
            data-testid="search-autocomplete"
            id="combo-box"
            options={initialCourses.map((course) => course.name)}
            renderOption={(props, option) => {
              return (
                <li {...props} key={option}>
                  {option}
                </li>
              );
            }}
            sx={{
              width: '250px',
              '& .MuiAutocomplete-inputRoot': {
                backgroundColor: palette.white.main,
              },
            }}
            renderInput={(value) => (
              <TextField {...value} label="Search by name" />
            )}
            onChange={(event, value) => {
              handleNameChange(value);
            }}
          />
        </div>
        <div style={{ marginBottom: '5px' }}>
          <DatePicker
            fixedHeight
            placeholderText="Search by dates"
            minDate={new Date()}
            selected={startDate}
            onChange={handleDateChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            showWeekNumbers
            isClearable
            customInput={<input style={InputStyles.datepicker} />}
            withPortal
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <FormControl sx={{ m: 1, width: 250 }}>
            <InputLabel id="tagSelection">Tag</InputLabel>
            <Select
              labelId="tagSelection"
              id="tagSelection"
              multiple
              value={tagField}
              onChange={(e) => {
                const selectedTags = e.target.value;
                handleTagChange(e, selectedTags);
              }}
              input={<OutlinedInput label="Tag" sx={{ background: 'white' }} />}
              renderValue={(selected) => selected.join(', ')}
            >
              {initialTags.map((tag) => (
                <MenuItem key={tag.id} value={tag.name}>
                  <Checkbox checked={tagField.indexOf(tag.name) > -1} />
                  <ListItemText primary={tag.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div>
          <Typography
            variant="body2"
            onClick={() => handleClearSearch()}
            sx={{
              cursor: 'pointer',
              paddingLeft: '10px',
              color: palette.primary.main,
              transition: 'color 0.3s',
              '&:hover': {
                color: palette.secondary.main,
              },
            }}
          >
            Clear Seach
          </Typography>
        </div>
      </Box>
    </>
  );
}
