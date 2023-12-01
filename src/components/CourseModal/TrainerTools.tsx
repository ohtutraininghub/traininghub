import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import PeopleIcon from '@mui/icons-material/People';
import Typography from '@mui/material/Typography';

interface Props {
  courseView: string | null;
  handleCourseViewToggle: (
    _event: React.MouseEvent<HTMLElement>,
    _newView: string | null
  ) => void;
  viewCourseDetailsLabel: string;
  viewEnrolledStudentsLabel: string;
}

export default function TrainerTools({
  courseView,
  handleCourseViewToggle,
  viewCourseDetailsLabel,
  viewEnrolledStudentsLabel,
}: Props) {
  return (
    <>
      <div>
        <ToggleButtonGroup
          value={courseView}
          exclusive
          onChange={handleCourseViewToggle}
          aria-label="course view"
        >
          <ToggleButton
            value="details"
            aria-label="course details"
            sx={{
              width: '72px',
              '&.Mui-selected, &.Mui-selected:hover': {
                color: 'secondary.contrastText',
                backgroundColor: 'coverBlue.dark',
              },
            }}
          >
            <TextSnippetIcon sx={{ color: 'white.main' }} />
          </ToggleButton>
          <ToggleButton
            value="attendees"
            aria-label="attendees list"
            sx={{
              width: '72px',
              '&.Mui-selected, &.Mui-selected:hover': {
                color: 'secondary.contrastText',
                backgroundColor: 'coverBlue.dark',
              },
            }}
          >
            <PeopleIcon sx={{ color: 'white.main' }} />
          </ToggleButton>
          §{' '}
        </ToggleButtonGroup>
      </div>
      <div>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 500,
            textTransform: 'uppercase',
            color: 'white.main',
            ml: '12px',
            mr: '12px',
          }}
        >
          {viewCourseDetailsLabel}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 500,
            color: 'white.main',
            textTransform: 'uppercase',
            ml: '6px',
            mr: '6px',
          }}
        >
          {viewEnrolledStudentsLabel}
        </Typography>
      </div>
    </>
  );
}
