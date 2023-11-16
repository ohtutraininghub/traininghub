import { ButtonGroup, Divider, IconButton, Tooltip } from '@mui/material';
import { useCurrentEditor } from '@tiptap/react';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import LinkIcon from '@mui/icons-material/Link';
import FormatStrikethroughIcon from '@mui/icons-material/FormatStrikethrough';
import CodeIcon from '@mui/icons-material/Code';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatClearIcon from '@mui/icons-material/FormatClear';
import { DictProps } from '@/lib/i18n';
import { useTranslation } from '@/lib/i18n/client';

export const MenuBar = ({ lang }: DictProps) => {
  const { editor } = useCurrentEditor();
  const { t } = useTranslation(lang, 'components');

  const handleToggleLink = () => {
    const url = window.prompt(t('TextEditor.linkPrompt'));

    if (url && editor) {
      editor
        .chain()
        .focus()
        .toggleLink({ href: 'https://' + url })
        .run();
    }
  };

  return (
    editor && (
      <>
        <ButtonGroup sx={{ flexWrap: 'wrap' }}>
          <IconButton
            data-testid="courseFormDescription"
            sx={{ color: 'black.main' }}
            onClick={() => editor.chain().focus().setParagraph().run()}
          >
            Paragraph
          </IconButton>

          <IconButton
            sx={{ color: 'black.main' }}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            H1
          </IconButton>

          <IconButton
            sx={{ color: 'black.main' }}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            H2
          </IconButton>

          <IconButton
            sx={{ color: 'black.main' }}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
          >
            H3
          </IconButton>

          <Divider
            sx={{ mr: 1, ml: 1 }}
            orientation="vertical"
            variant="middle"
            flexItem
          />

          <Tooltip title={t('TextEditor.Tooltip.bold')} arrow>
            <IconButton
              sx={editor.isActive('bold') ? { color: 'black.main' } : {}}
              onClick={() => editor.chain().focus().toggleBold().run()}
              disabled={!editor.can().chain().focus().toggleBold().run()}
            >
              <FormatBoldIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={t('TextEditor.Tooltip.italic')} arrow>
            <IconButton
              sx={editor.isActive('italic') ? { color: 'black.main' } : {}}
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={!editor.can().chain().focus().toggleItalic().run()}
            >
              <FormatItalicIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={t('TextEditor.Tooltip.strike')} arrow>
            <IconButton
              sx={editor.isActive('strike') ? { color: 'black.main' } : {}}
              onClick={() => editor.chain().focus().toggleStrike().run()}
              disabled={!editor.can().chain().focus().toggleStrike().run()}
            >
              <FormatStrikethroughIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={t('TextEditor.Tooltip.code')} arrow>
            <IconButton
              sx={editor.isActive('code') ? { color: 'black.main' } : {}}
              onClick={() => editor.chain().focus().toggleCode().run()}
              disabled={!editor.can().chain().focus().toggleCode().run()}
            >
              <CodeIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={t('TextEditor.Tooltip.link')} arrow>
            <IconButton onClick={handleToggleLink}>
              <LinkIcon />
            </IconButton>
          </Tooltip>

          <Divider
            sx={{ mr: 1, ml: 1 }}
            orientation="vertical"
            variant="middle"
            flexItem
          />

          <Tooltip title={t('TextEditor.Tooltip.bulletList')} arrow>
            <IconButton
              sx={editor.isActive('bulletList') ? { color: 'black.main' } : {}}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <FormatListBulletedIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={t('TextEditor.Tooltip.orderedList')} arrow>
            <IconButton
              sx={editor.isActive('orderedList') ? { color: 'black.main' } : {}}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              <FormatListNumberedIcon />
            </IconButton>
          </Tooltip>

          <Divider
            sx={{ mr: 1, ml: 1 }}
            orientation="vertical"
            variant="middle"
            flexItem
          />

          <Tooltip title={t('TextEditor.Tooltip.clearFormat')} arrow>
            <IconButton
              onClick={() => editor.chain().focus().unsetAllMarks().run()}
            >
              <FormatClearIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={t('TextEditor.Tooltip.undo')} arrow>
            <span>
              <IconButton
                onClick={() => editor.commands.undo()}
                disabled={!editor.can().chain().focus().undo().run()}
              >
                <UndoIcon />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title={t('TextEditor.Tooltip.redo')} arrow>
            <span>
              <IconButton
                onClick={() => editor.commands.redo()}
                disabled={!editor.can().chain().focus().redo().run()}
              >
                <RedoIcon />
              </IconButton>
            </span>
          </Tooltip>
        </ButtonGroup>
        <Divider />
      </>
    )
  );
};
