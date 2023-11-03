'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Autocomplete,
  TextField,
  Button,
  Typography,
  Chip,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { useCallback } from 'react';
import { CourseWithTagsAndStudentCount } from '@/lib/prisma/courses';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { t } from 'i18next';
import { Controller, useForm } from 'react-hook-form';
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

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [courseName, setCourseName] = useState('');

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

  const handleTagChange = async (tagList: string) => {
    const tagListQueryParam =
      tagList === '' ? '' : createQueryString('courseTag', tagList);
    router.push(pathname + '?' + tagListQueryParam);
  };

  const handleDateChange = async (range: [any, any]) => {
    const [startDate, endDate] = range;
    setStartDate(startDate);
    setEndDate(endDate);
    const dateRangeQueryParam =
      startDate === null && endDate === null
        ? ''
        : createQueryString('courseDates', startDate + '-' + endDate);

    router.push(pathname + '?' + dateRangeQueryParam);
  };

  const handleClearSearch = async () => {
    await handleNameChange(null);
    await handleDateChange([null, null]);
    control._reset();
    router.replace(pathname);
  };

  const InputStyles = {
    datepicker: {
      width: '250px',
      height: '55px',
      fontSize: '16px',
    },

    deleteIcon: {
      width: 60,
      height: 60,
    },
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
          onClick={() => handleClearSearch()}
          sx={{
            width: '50px',
            height: '50px',
            marginRight: '50px',
          }}
          title="Clear"
        >
          <DeleteSweepIcon style={InputStyles.deleteIcon} />
        </Button>
        <div>
          <Autocomplete
            value={courseName || null}
            clearOnEscape
            disablePortal
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
            sx={{ width: '250px', marginRight: '50px' }}
            renderInput={(value) => (
              <TextField {...value} label="Search by a name" />
            )}
            onChange={(event, value) => {
              handleNameChange(value);
            }}
          />
        </div>
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
          customInput={<input style={InputStyles.datepicker} />}
        />
      </Box>
      <Controller
        name="tags"
        control={control}
        defaultValue={[]}
        render={({ field }) => {
          return (
            <>
              <InputLabel htmlFor="tagSelection">
                {t('CourseForm.tags')}
              </InputLabel>
              <Select
                {...field}
                id="tagSelection"
                multiple
                onChange={(e) => {
                  const newSelectedTags = e.target.value;
                  field.onChange(newSelectedTags);
                  handleTagChange(newSelectedTags);
                }}
                renderValue={(field) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {field.map(
                      (
                        tag:
                          | string
                          | number
                          | boolean
                          | React.ReactElement<
                              any,
                              string | React.JSXElementConstructor<any>
                            >
                          | Iterable<React.ReactNode>
                          | React.ReactPortal
                          | React.PromiseLikeOfReactNode
                          | null
                          | undefined,
                        idx: React.Key | null | undefined
                      ) => (
                        <Chip
                          key={idx}
                          label={tag}
                          variant="outlined"
                          sx={{
                            backgroundColor: palette.surface.light,
                            borderColor: palette.black.light,
                          }}
                        />
                      )
                    )}
                  </Box>
                )}
              >
                {initialTags.map((tag) => (
                  <MenuItem
                    key={tag.id}
                    value={tag.name}
                    divider
                    sx={{
                      '&.Mui-selected': {
                        backgroundColor: palette.surface.main,
                      },
                      '&.Mui-selected.Mui-focusVisible': {
                        backgroundColor: palette.surface.dark,
                      },
                      '&:hover': {
                        backgroundColor: palette.surface.light,
                      },
                      '&.Mui-selected:hover': {
                        backgroundColor: palette.surface.main,
                      },
                    }}
                  >
                    {tag.name}
                  </MenuItem>
                ))}
              </Select>
            </>
          );
        }}
      />
    </>
  );
}
