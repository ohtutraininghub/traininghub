import {
  ButtonGroup,
  Divider,
  MenuItem,
  Select,
  SelectChangeEvent,
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
import { ClickHandler, MenuBarItem } from './MenuBarItem';

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
            data-testid="textEditorTextSelect"
          >
            <MenuItem
              sx={menuItemSx}
              value={'header1'}
              data-testid="textSelectorHeader1"
            >
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
            <MenuItem
              sx={menuItemSx}
              value={'paragraph'}
              data-testid="textSelectorParagraph"
            >
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

          <MenuBarItem
            tooltip={t('TextEditor.Tooltip.bold')}
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            sx={editor.isActive('bold') ? emphasize : {}}
            icon={<FormatBoldIcon />}
          />

          <MenuBarItem
            tooltip={t('TextEditor.Tooltip.italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            sx={editor.isActive('italic') ? emphasize : {}}
            icon={<FormatItalicIcon />}
          />

          <MenuBarItem
            tooltip={t('TextEditor.Tooltip.strike')}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            sx={editor.isActive('strike') ? emphasize : {}}
            icon={<FormatStrikethroughIcon />}
          />

          <MenuBarItem
            tooltip={t('TextEditor.Tooltip.underline')}
            sx={editor.isActive('underline') ? emphasize : {}}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            disabled={!editor.can().chain().focus().toggleUnderline().run()}
            icon={<FormatUnderlinedIcon />}
          />

          <MenuBarItem
            tooltip={t('TextEditor.Tooltip.code')}
            sx={editor.isActive('code') ? emphasize : {}}
            onClick={() => editor.chain().focus().toggleCode().run()}
            disabled={!editor.can().chain().focus().toggleCode().run()}
            icon={<CodeIcon />}
          />

          <Divider
            sx={{ mr: 1, ml: 1 }}
            orientation="vertical"
            variant="middle"
            flexItem
          />

          <MenuBarItem
            tooltip={t('TextEditor.Tooltip.link')}
            sx={editor.isActive('link') ? emphasize : {}}
            id="addLinkButton"
            onClick={handlePromptOpen as ClickHandler}
            icon={<LinkIcon />}
          />

          <MenuBarItem
            tooltip={t('TextEditor.Tooltip.image')}
            sx={editor.isActive('image') ? emphasize : {}}
            id="addImageButton"
            onClick={handlePromptOpen as ClickHandler}
            icon={<InsertPhotoIcon />}
          />

          <Divider
            sx={{ mr: 1, ml: 1 }}
            orientation="vertical"
            variant="middle"
            flexItem
          />

          <MenuBarItem
            tooltip={t('TextEditor.Tooltip.alignLeft')}
            sx={editor.isActive({ textAlign: 'left' }) ? emphasize : {}}
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            disabled={!editor.can().chain().focus().setTextAlign('left').run()}
            icon={<FormatAlignLeftIcon />}
          />

          <MenuBarItem
            tooltip={t('TextEditor.Tooltip.alignCenter')}
            sx={editor.isActive({ textAlign: 'center' }) ? emphasize : {}}
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            disabled={
              !editor.can().chain().focus().setTextAlign('center').run()
            }
            icon={<FormatAlignCenterIcon />}
          />

          <MenuBarItem
            tooltip={t('TextEditor.Tooltip.alignRight')}
            sx={editor.isActive({ textAlign: 'right' }) ? emphasize : {}}
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            disabled={!editor.can().chain().focus().setTextAlign('right').run()}
            icon={<FormatAlignRightIcon />}
          />

          <MenuBarItem
            tooltip={t('TextEditor.Tooltip.alignJustify')}
            sx={editor.isActive({ textAlign: 'justify' }) ? emphasize : {}}
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            disabled={
              !editor.can().chain().focus().setTextAlign('justify').run()
            }
            icon={<FormatAlignJustifyIcon />}
          />

          <Divider
            sx={{ mr: 1, ml: 1 }}
            orientation="vertical"
            variant="middle"
            flexItem
          />

          <MenuBarItem
            tooltip={t('TextEditor.Tooltip.bulletList')}
            sx={editor.isActive('bulletList') ? emphasize : {}}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            disabled={!editor.can().chain().focus().toggleBulletList().run()}
            icon={<FormatListBulletedIcon />}
          />

          <MenuBarItem
            tooltip={t('TextEditor.Tooltip.orderedList')}
            sx={editor.isActive('orderedList') ? emphasize : {}}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            disabled={!editor.can().chain().focus().toggleOrderedList().run()}
            icon={<FormatListNumberedIcon />}
          />

          <Divider
            sx={{ mr: 1, ml: 1 }}
            orientation="vertical"
            variant="middle"
            flexItem
          />

          <MenuBarItem
            tooltip={t('TextEditor.Tooltip.clearFormat')}
            onClick={() => editor.chain().focus().unsetAllMarks().run()}
            disabled={!editor.can().chain().focus().unsetAllMarks().run()}
            icon={<FormatClearIcon />}
          />

          <MenuBarItem
            tooltip={t('TextEditor.Tooltip.undo')}
            onClick={() => editor.commands.undo()}
            disabled={!editor.can().chain().focus().undo().run()}
            icon={<UndoIcon />}
          />

          <MenuBarItem
            tooltip={t('TextEditor.Tooltip.redo')}
            onClick={() => editor.commands.redo()}
            disabled={!editor.can().chain().focus().redo().run()}
            icon={<RedoIcon />}
          />
        </ButtonGroup>
        <Divider />
      </>
    )
  );
};
