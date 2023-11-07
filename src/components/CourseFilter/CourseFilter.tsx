'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Autocomplete,
  TextField,
  Chip,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import BackspaceIcon from '@mui/icons-material/Backspace';
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

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
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
    const { courseName, courseTag, courseDates, courseId } = Object.fromEntries(
      searchParams.entries()
    );
    if (!courseName && !courseTag && !courseDates && !courseId) {
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

  const handleTagChange = async (tagList: string[]) => {
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
          padding: '16px',
          flexWrap: 'wrap',
          paddingBottom: '10px',
        }}
      >
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
            sx={{
              width: '250px',
              marginRight: '20px',
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
        />
        <div>
          <BackspaceIcon
            onClick={() => handleClearSearch()}
            sx={{
              cursor: 'pointer',
              width: '30px',
              height: '30px',
              paddingLeft: '10px',
              color: palette.white.main,
              transition: 'color 0.3s',
              '&:hover': {
                color: palette.secondary.main,
              },
            }}
          />
        </div>
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
                  const selectedTags = e.target.value;
                  field.onChange(selectedTags);
                  handleTagChange(selectedTags);
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
