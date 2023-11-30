import {
  ButtonGroup,
  Divider,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tooltip,
  Typography,
} from '@mui/material';
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
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import { DictProps } from '@/lib/i18n';
import { useTranslation } from '@/lib/i18n/client';
import { useState } from 'react';
import { PromptWindow, type AnchorWithContext, CallbackObj } from './urlPrompt';
import { TextSelection } from '@tiptap/pm/state';

export const MenuBar = ({ lang }: DictProps) => {
  const { editor } = useCurrentEditor();
  const { t } = useTranslation(lang, 'components');
  const [anchorObj, setAnchorObj] = useState<null | AnchorWithContext>(null);
  const promptOpen = !!anchorObj;

  const getTextSelection = () => {
    if (!editor) return undefined;
    const { view, state } = editor;
    const { from, to } = view.state.selection;
    return state.doc.textBetween(from, to, '');
  };

  const replaceTextSelection = (newText: string): void => {
    if (!editor) return;
    const { state, dispatch } = editor.view;
    const { selection, tr } = state;
    const { from, to } = selection;
    dispatch(
      tr
        .insertText(newText, from, to)
        .setSelection(TextSelection.create(tr.doc, from, from + newText.length))
    );
  };

  const handlePromptOpen = (event: React.MouseEvent<HTMLElement>) => {
    const selection = getTextSelection();
    const obj: AnchorWithContext = {
      element: event.currentTarget,
      state: event.currentTarget.id === 'addLinkButton' ? 'link' : 'image',
      text: selection ? selection : '',
    };
    setAnchorObj(anchorObj ? null : obj);
  };

  const urlPromptCallback = (props: CallbackObj | null) => {
    setAnchorObj(null);
    if (!props) return;
    if (props.url && editor) {
      if (props.state === 'image') {
        editor.chain().focus().setImage({ src: props.url }).run();
      } else if (props.state === 'link') {
        if (!props.text) {
          replaceTextSelection(props.url);
        } else {
          replaceTextSelection(props.text);
        }
        editor.chain().focus().toggleLink({ href: props.url }).run();
      }
    }
  };

  const dropdownValue = () => {
    if (!editor) return '';
    if (editor.isActive('heading', { level: 1 })) {
      return 'header1';
    } else if (editor.isActive('heading', { level: 2 })) {
      return 'header2';
    } else if (editor.isActive('heading', { level: 3 })) {
      return 'header3';
    } else {
      return 'paragraph';
    }
  };

  const dropdownOnChange = (event: SelectChangeEvent) => {
    if (!editor) return null;
    switch (event.target.value) {
      case 'paragraph':
        editor.chain().focus().setParagraph().run();
        break;
      case 'header1':
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        break;
      case 'header2':
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      case 'header3':
        editor.chain().focus().toggleHeading({ level: 3 }).run();
        break;
      default:
        return null;
    }
  };

  const emphasize = { color: 'black.main' };

  const menuItemSx = {
    '&.Mui-selected': {
      backgroundColor: 'surface.main',
    },
    '&.Mui-selected.Mui-focusVisible': {
      backgroundColor: 'surface.main',
    },
    '&:hover': {
      backgroundColor: 'surface.light',
    },
    '&.Mui-selected:hover': {
      backgroundColor: 'surface.main',
    },
  };

  return (
    editor && (
      <>
        <ButtonGroup sx={{ flexWrap: 'wrap' }}>
          <PromptWindow
            lang={lang}
            open={promptOpen}
            anchorObj={anchorObj}
            callbackFn={urlPromptCallback}
          />

          <Select
            sx={{ ml: 1, mb: -1, minWidth: 120 }}
            size="small"
            variant="standard"
            value={dropdownValue()}
            onChange={dropdownOnChange}
            disableUnderline
          >
            <MenuItem sx={menuItemSx} value={'header1'}>
              <Typography variant="h4">
                {t('TextEditor.Dropdown.header1')}
              </Typography>
            </MenuItem>
            <MenuItem sx={menuItemSx} value={'header2'}>
              <Typography variant="h4">
                {t('TextEditor.Dropdown.header2')}
              </Typography>
            </MenuItem>
            <MenuItem sx={menuItemSx} value={'header3'}>
              <Typography variant="h4">
                {t('TextEditor.Dropdown.header3')}
              </Typography>
            </MenuItem>
            <MenuItem sx={menuItemSx} value={'paragraph'}>
              <Typography variant="body1">
                {t('TextEditor.Dropdown.paragraph')}
              </Typography>
            </MenuItem>
          </Select>

          <Divider
            sx={{ mr: 1, ml: 1 }}
            orientation="vertical"
            variant="middle"
            flexItem
          />

          <Tooltip title={t('TextEditor.Tooltip.bold')} arrow>
            <IconButton
              data-testid="courseFormBoldButton"
              sx={editor.isActive('bold') ? emphasize : {}}
              onClick={() => editor.chain().focus().toggleBold().run()}
              disabled={!editor.can().chain().focus().toggleBold().run()}
            >
              <FormatBoldIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={t('TextEditor.Tooltip.italic')} arrow>
            <IconButton
              sx={editor.isActive('italic') ? emphasize : {}}
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={!editor.can().chain().focus().toggleItalic().run()}
            >
              <FormatItalicIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={t('TextEditor.Tooltip.strike')} arrow>
            <IconButton
              sx={editor.isActive('strike') ? emphasize : {}}
              onClick={() => editor.chain().focus().toggleStrike().run()}
              disabled={!editor.can().chain().focus().toggleStrike().run()}
            >
              <FormatStrikethroughIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={t('TextEditor.Tooltip.underline')} arrow>
            <IconButton
              sx={editor.isActive('underline') ? emphasize : {}}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              disabled={!editor.can().chain().focus().toggleUnderline().run()}
            >
              <FormatUnderlinedIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={t('TextEditor.Tooltip.code')} arrow>
            <IconButton
              sx={editor.isActive('code') ? emphasize : {}}
              onClick={() => editor.chain().focus().toggleCode().run()}
              disabled={!editor.can().chain().focus().toggleCode().run()}
            >
              <CodeIcon />
            </IconButton>
          </Tooltip>

          <Divider
            sx={{ mr: 1, ml: 1 }}
            orientation="vertical"
            variant="middle"
            flexItem
          />

          <Tooltip title={t('TextEditor.Tooltip.link')} arrow>
            <IconButton id="addLinkButton" onClick={handlePromptOpen}>
              <LinkIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={t('TextEditor.Tooltip.image')} arrow>
            <IconButton id="addImageButton" onClick={handlePromptOpen}>
              <InsertPhotoIcon />
            </IconButton>
          </Tooltip>

          <Divider
            sx={{ mr: 1, ml: 1 }}
            orientation="vertical"
            variant="middle"
            flexItem
          />

          <Tooltip title={t('TextEditor.Tooltip.alignLeft')} arrow>
            <IconButton
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
            >
              <FormatAlignLeftIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={t('TextEditor.Tooltip.alignCenter')} arrow>
            <IconButton
              onClick={() =>
                editor.chain().focus().setTextAlign('center').run()
              }
            >
              <FormatAlignCenterIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={t('TextEditor.Tooltip.alignRight')} arrow>
            <IconButton
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
            >
              <FormatAlignRightIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={t('TextEditor.Tooltip.alignJustify')} arrow>
            <IconButton
              onClick={() =>
                editor.chain().focus().setTextAlign('justify').run()
              }
            >
              <FormatAlignJustifyIcon />
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
              sx={editor.isActive('bulletList') ? emphasize : {}}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <FormatListBulletedIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={t('TextEditor.Tooltip.orderedList')} arrow>
            <IconButton
              sx={editor.isActive('orderedList') ? emphasize : {}}
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
