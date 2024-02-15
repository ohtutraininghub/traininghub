'use client';

import React, { useState } from 'react';
import { List } from '@mui/material';
import { ListItem } from '@mui/material';
import { ListItemText } from '@mui/material';
import { Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Box, Tooltip, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import IconButton from '@mui/material/IconButton';
import { DeleteTemplateButton } from '@/components/DeleteTemplate/DeleteTemplateButton';
import { TemplateSearchBar } from '@/components/TemplateSearchBar/TemplateSearchBar';
import { EditTemplateButton } from '@/components/EditTemplate/EditTemplateButton';
import CourseTemplateModal from '@/components/CourseTemplateModal';
import { Locale, i18n } from '@/lib/i18n/i18n-config';
import { useTranslation } from '@i18n/client';
import { TemplateWithCreator } from '@/lib/prisma/templates';

export interface ProfileCourseListProps {
  headerText: string;
  templates: TemplateWithCreator[];
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
  const { t } = useTranslation(lang, 'components');
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.createdBy?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditButtonClick = (templateId: string) => {
    setSelectedTemplate(templateId);
    setIsTemplateModalOpen(true);
  };

  const handleCloseTemplateModal = () => {
    setIsTemplateModalOpen(false);
    setSelectedTemplate(null);
  };

  return (
    <Box sx={{ marginTop: '10px', backgroundColor: palette.surface.main }}>
      <Typography
        sx={{
          backgroundColor: palette.secondary.main,
          color: palette.white.main,
          paddingLeft: '10px',
        }}
        variant="subtitle2"
        data-testid="templateListHeader"
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
            data-testid="templateListControls"
          >
            {isCollapsed ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Tooltip>
      </Typography>
      {isCollapsed && (
        <>
          <TemplateSearchBar lang={lang} onSearchTermChange={setSearchTerm} />
          {filteredTemplates.length === 0 ? (
            <Typography
              sx={{ padding: '10px' }}
              variant="body2"
              data-testid="noTemplatesMessage"
            >
              {t('TemplateSearchBar.Filter.notFound')}
            </Typography>
          ) : (
            <List
              style={{ backgroundColor: palette.surface.main }}
              data-testid="templateList"
            >
              {filteredTemplates.map(
                (template: TemplateWithCreator, index: number) => (
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
                        secondary={template.createdBy?.name}
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
                    {index < filteredTemplates.length - 1 && <Divider />}
                  </React.Fragment>
                )
              )}
            </List>
          )}
        </>
      )}
      {isTemplateModalOpen && selectedTemplate && (
        <CourseTemplateModal
          templateId={selectedTemplate}
          open={isTemplateModalOpen}
          onClose={handleCloseTemplateModal}
        />
      )}
    </Box>
  );
}
