'use client';

import React from 'react';
import { List } from '@mui/material';
import { ListItem } from '@mui/material';
import { ListItemText } from '@mui/material';
import { Divider } from '@mui/material';
import { Tag, Template } from '@prisma/client';
import { useTheme } from '@mui/material/styles';
import { Box, Tooltip, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import IconButton from '@mui/material/IconButton';
import { useState } from 'react';
import { DeleteTemplateButton } from '@/components/DeleteTemplate/DeleteTemplateButton';
import { TemplateSearchBar } from '@/components/TemplateSearchBar/TemplateSearchBar';
import { EditTemplateButton } from '@/components/EditTemplate/EditTemplateButton';
import CourseTemplateModal from '@/components/CourseTemplateModal';
import { Locale, i18n } from '@/lib/i18n/i18n-config';

export interface ProfileCourseListProps {
  headerText: string;
  templates: Template[];
  open: boolean;
  timer?: boolean;
  tags: Tag[];
}

export default function ProfileTemplateList({
  headerText,
  templates,
  open,
  tags,
}: ProfileCourseListProps) {
  const { palette } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(open);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const lang: Locale = i18n.defaultLocale;

  const handleEditButtonClick = (templateId: string) => {
    console.log('handleEditButtonClick');
    setSelectedTemplate(templateId);
    setIsTemplateModalOpen(true);
  };

  const handleCloseTemplateModal = () => {
    console.log('handleCloseTemplateModal');
    setIsTemplateModalOpen(false);
    setSelectedTemplate(null);
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
        data-testid="templateListHeader"
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
            data-testid="templateListControls"
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
              data-testid="templateList"
            >
              <TemplateSearchBar lang={lang} />
              {templates.map((template: Template, count: number) => (
                <React.Fragment key={template.id}>
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
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <EditTemplateButton
                        templateId={template.id}
                        lang={lang}
                        onClick={() => handleEditButtonClick(template.id)}
                      />
                      <DeleteTemplateButton
                        templateId={template.id}
                        lang={lang}
                      />
                    </Box>
                  </ListItem>

                  {count < templates.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </>
      )}
      {isTemplateModalOpen && selectedTemplate && (
        <CourseTemplateModal
          tags={tags}
          lang={lang}
          templateId={selectedTemplate}
          open={isTemplateModalOpen}
          onClose={handleCloseTemplateModal}
        />
      )}
    </Box>
  );
}
