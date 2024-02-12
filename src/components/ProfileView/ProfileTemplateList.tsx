'use client';

import React, { useState } from 'react';
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
import { DeleteTemplateButton } from '@/components/DeleteTemplate/DeleteTemplateButton';
import { TemplateSearchBar } from '@/components/TemplateSearchBar/TemplateSearchBar';
import { EditTemplateButton } from '@/components/EditTemplate/EditTemplateButton';
import { Locale, i18n } from '@/lib/i18n/i18n-config';

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
  const [isCollapsed, setIsCollapsed] = useState(open);
  const [searchTerm, setSearchTerm] = useState('');
  const { palette } = useTheme();
  const lang: Locale = i18n.defaultLocale;

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ marginTop: '10px', backgroundColor: palette.surface.main }}>
      <Typography
        sx={{
          backgroundColor: palette.secondary.main,
          color: palette.white.main,
          paddingLeft: '10px',
        }}
        variant="subtitle2"
        data-testid="listHeader"
      >
        {`${headerText} (${filteredTemplates.length})`}
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
      {isCollapsed && (
        <>
          <TemplateSearchBar lang={lang} onSearchTermChange={setSearchTerm} />
          {filteredTemplates.length === 0 ? (
            <Typography sx={{ padding: '10px' }} variant="body2">
              No templates to show.
            </Typography>
          ) : (
            <List style={{ backgroundColor: palette.surface.main }}>
              {filteredTemplates.map((template: Template, index: number) => (
                <React.Fragment key={template.id}>
                  <ListItem
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
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <EditTemplateButton
                        templateId={template.id}
                        lang={lang}
                      />
                      <DeleteTemplateButton
                        templateId={template.id}
                        lang={lang}
                      />
                    </Box>
                  </ListItem>
                  {index < filteredTemplates.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </>
      )}
    </Box>
  );
}
