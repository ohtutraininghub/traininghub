import { IconButton, SxProps, Tooltip } from '@mui/material';
import { ReactElement } from 'react';

export type ClickHandler = {
  (): void;
  (_event: React.MouseEvent<HTMLElement>): void;
};

type TMenuBarItem = {
  tooltip: string;
  onClick: ClickHandler;
  disabled?: boolean;
  sx?: SxProps | undefined;
  id?: string;
  icon: ReactElement;
};

/**
 * General use component for buttons to not clutter main file with wrapping tags
 **/
export const MenuBarItem = ({
  tooltip,
  onClick,
  disabled,
  sx,
  icon,
  id,
}: TMenuBarItem) => {
  return (
    <>
      <Tooltip title={tooltip} arrow>
        <span>
          <IconButton
            id={id}
            sx={sx}
            onClick={onClick}
            disabled={disabled ? disabled : false}
          >
            {icon}
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
};
