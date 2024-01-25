'use client';

import React from 'react';
import Link from 'next/link';
import { List } from '@mui/material';
import { ListItem } from '@mui/material';
import { ListItemText } from '@mui/material';
import { Divider } from '@mui/material';
import { Template } from '@prisma/client';
import { useTheme } from '@mui/material/styles';
import { Box, Tooltip, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import IconButton from '@mui/material/IconButton';
import { useState } from 'react';

export interface ProfileCourseListProps {
  headerText: string;
  templates: Template[];
  open: boolean;
  timer?: boolean;
}

export default function ProfileTemplateList({
  headerText,
  templates,
  open,
}: ProfileCourseListProps) {
  const { palette } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(open);

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Box
      sx={{
        paddingTop: '10px',
      }}
    >
      <Typography
        sx={{
          backgroundColor: palette.secondary.main,
          color: palette.white.main,
          paddingLeft: '10px',
        }}
        variant="subtitle2"
        data-testid="listHeader"
      >
        {`${headerText} (${templates.length})`}
        <Tooltip
          title={isCollapsed ? 'Close' : 'Expand'}
          arrow
          placement="right"
        >
          <IconButton
            sx={{ color: palette.white.main }}
            onClick={handleToggleCollapse}
            data-testid="listControls"
          >
            {isCollapsed ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Tooltip>
      </Typography>
      {!isCollapsed ? null : (
        <>
          {templates.length === 0 ? (
            <Typography
              sx={{
                padding: '10px',
              }}
              variant="body2"
            >
              No templates to show.
            </Typography>
          ) : (
            <List
              style={{
                backgroundColor: palette.surface.main,
              }}
            >
              {templates.map((template: Template, count: number) => (
                <React.Fragment key={template.id}>
                  <Link
                    href={`profile/?templateId=${template.id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <ListItem
                      key={template.id}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        backgroundColor: 'transparent',
                        '&:hover': {
                          backgroundColor: palette.surface.light,
                        },
                      }}
                    >
                      <ListItemText
                        primary={template.name}
                        sx={{ color: palette.black.main }}
                      />
                    </ListItem>
                  </Link>
                  {count < templates.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </>
      )}
    </Box>
  );
}
