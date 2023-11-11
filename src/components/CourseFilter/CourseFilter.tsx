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
import { Tag } from '@prisma/client';
import { DictProps } from '@i18n/index';
import { useTranslation } from '@i18n/client';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import 'react-datepicker/dist/react-datepicker.css';

interface CourseFilterProps extends DictProps {
  initialCourses: CourseWithTagsAndStudentCount[];
  initialTags: Tag[];
}

export default function CourseFilter({
  initialCourses,
  initialTags,
  lang,
}: CourseFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const theme = useTheme();

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [courseName, setCourseName] = useState('');
  const [tagField, setTagField] = useState<string[]>([]);

  const { t } = useTranslation(lang, 'components', {
    keyPrefix: 'CourseFilter',
  });

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const deleteSearchParam = (name: string) => {
    const params = new URLSearchParams(searchParams);
    params.delete(name);
    router.push(`${pathname}?${params.toString()}`);
  };

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

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    if (!date) {
      return deleteSearchParam('startDate');
    }
    const param = createQueryString('startDate', date.toString());
    return router.push(`${pathname}?${param}`);
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
    if (!date) {
      return deleteSearchParam('endDate');
    }
    const param = createQueryString('endDate', date.toString());
    return router.push(`${pathname}?${param}`);
  };

  const handleClearSearch = useCallback(async () => {
    setCourseName('');
    setStartDate(null);
    setEndDate(null);
    setTagField([]);
    router.replace(pathname);
  }, [setCourseName, setStartDate, setEndDate, setTagField, router, pathname]);

  useEffect(() => {
    const { courseName, courseTag, startDate, endDate, courseId } =
      Object.fromEntries(searchParams.entries());
    if (!courseName && !courseTag && !startDate && !endDate && !courseId) {
      handleClearSearch();
    }
    if (courseName) {
      setCourseName(courseName);
    }
    if (courseTag) {
      const parsedTags = courseTag.split(',');
      setTagField(parsedTags);
    }
    if (startDate) {
      setStartDate(new Date(startDate));
    }
    if (endDate) {
      setEndDate(new Date(endDate));
    }
  }, [searchParams, handleClearSearch]);

  return (
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
      {/* Start search by name field*/}

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
          marginBottom: '10px',
          width: '250px',
          boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
          [theme.breakpoints.up('sm')]: {
            width: '300px',
          },
          '& .MuiAutocomplete-inputRoot': {
            color: theme.palette.white.main,
            backgroundColor: theme.palette.coverBlue.light,
          },
        }}
        renderInput={(value) => (
          <TextField
            {...value}
            label={t('label.courseName')}
            sx={{
              '& .MuiInputLabel-root': { color: theme.palette.white.main },
            }}
          />
        )}
        onChange={(event, value) => {
          handleNameChange(value);
        }}
      />

      {/* Start Date Pickers*/}

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '250px',
          [theme.breakpoints.up('sm')]: {
            width: '300px',
          },
        }}
      >
        <DatePicker
          fixedHeight
          minDate={new Date()}
          selected={startDate}
          onChange={handleStartDateChange}
          showWeekNumbers
          isClearable
          customInput={
            <TextField
              label={t('label.startDate')}
              sx={{
                '& .MuiInputLabel-root': { color: theme.palette.white.main },
                '& .MuiOutlinedInput-input': {
                  color: theme.palette.white.main,
                },
                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
              }}
            />
          }
          withPortal
        />

        <HorizontalRuleIcon sx={{ color: theme.palette.white.main }} />

        <DatePicker
          fixedHeight
          minDate={startDate ? startDate : new Date()}
          selected={endDate}
          onChange={handleEndDateChange}
          showWeekNumbers
          isClearable
          customInput={
            <TextField
              label={t('label.endDate')}
              sx={{
                '& .MuiInputLabel-root': { color: theme.palette.white.main },
                '& .MuiOutlinedInput-input': {
                  color: theme.palette.white.main,
                },
                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
              }}
            />
          }
          withPortal
        />
      </Box>

      {/* Start Tag Selector*/}

      <FormControl
        sx={{
          m: 1,
          mb: 3,
          width: '250px',
          boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
          [theme.breakpoints.up('sm')]: {
            width: '300px',
          },
          '& .MuiInputLabel-root': { color: theme.palette.white.main },
        }}
      >
        <InputLabel id="tagSelection">{t('label.tag')}</InputLabel>
        <Select
          labelId="tagSelection"
          id="tagSelection"
          multiple
          value={tagField}
          onChange={(e) => {
            const selectedTags = e.target.value;
            handleTagChange(e, selectedTags);
          }}
          input={
            <OutlinedInput
              label="Tag"
              sx={{
                color: theme.palette.white.main,
              }}
            />
          }
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

      {/* Start clear search button*/}

      <Typography
        variant="body2"
        onClick={() => handleClearSearch()}
        sx={{
          cursor: 'pointer',
          paddingLeft: '10px',
          color: theme.palette.primary.main,
          transition: 'color 0.3s',
          '&:hover': {
            color: theme.palette.secondary.main,
          },
        }}
      >
        {t('button.clearSearch')}
      </Typography>
    </Box>
  );
}
