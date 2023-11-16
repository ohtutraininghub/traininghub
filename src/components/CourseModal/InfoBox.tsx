import { ComponentType } from 'react';
import { SvgIconProps } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface Props {
  infoText: string;
  Icon?: ComponentType<SvgIconProps>;
}

function InfoBoxContent({ infoText, Icon }: Props) {
  if (Icon) {
    return (
      <>
        <Icon sx={{ alignSelf: 'top', mr: 'auto' }} />
        <Typography variant="body2" sx={{ ml: 1, mr: 'auto' }}>
          {infoText}
        </Typography>
      </>
    );
  } else {
    return <Typography variant="body2">{infoText}</Typography>;
  }
}

export default function InfoBox({ infoText, Icon }: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexFlow: 'row',
        border: 0.5,
        borderRadius: '4px',
        mt: '1em',
        p: '1em',
        justifyContent: 'center',
      }}
    >
      <InfoBoxContent infoText={infoText} Icon={Icon} />
    </Box>
  );
}
