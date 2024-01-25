import { Box, Button } from '@mui/material';
import { remove } from '../../lib/response/fetchUtil';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMessage } from '../Providers/MessageProvider';
import Typography from '@mui/material/Typography';

// 200 ja 403 tai 404

interface Props {
  courseId: string;
  hidden: boolean;
}

const DeleteButton = ({ courseId, hidden }: Props) => {
  const { notify } = useMessage();

  const handleClick = async () => {
    const responseJson = await remove('url', { courseId: courseId });
    notify(responseJson);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flex: 1,
      }}
    >
      <Button
        style={{ textDecoration: 'none', color: 'inherit' }}
        hidden={hidden}
        onClick={handleClick}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'row-reverse', sm: 'column' },
            alignItems: 'center',
            width: 'fit-content',
            gap: 1,
            cursor: 'pointer',
            '&:hover': {
              color: 'info.main',
            },
          }}
        >
          <DeleteIcon />
          <Typography>{'remove'}</Typography>
        </Box>
      </Button>
    </Box>
  );
};

export default DeleteButton;
