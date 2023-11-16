import { ButtonGroup, Divider, IconButton } from '@mui/material';
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

export const MenuBar = () => {
  const { editor } = useCurrentEditor();

  const handleToggleLink = () => {
    const url = window.prompt('Add a link in the form of www.host.com');

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

          <IconButton onClick={() => editor.chain().focus().toggleBold().run()}>
            <FormatBoldIcon />
          </IconButton>

          <IconButton
            className={editor.isActive('italic') ? 'is-active' : ''}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <FormatItalicIcon />
          </IconButton>

          <IconButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <FormatStrikethroughIcon />
          </IconButton>

          <IconButton onClick={() => editor.chain().focus().toggleCode().run()}>
            <CodeIcon />
          </IconButton>

          <IconButton onClick={handleToggleLink}>
            <LinkIcon />
          </IconButton>

          <Divider
            sx={{ mr: 1, ml: 1 }}
            orientation="vertical"
            variant="middle"
            flexItem
          />

          <IconButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <FormatListBulletedIcon />
          </IconButton>

          <IconButton
            sx={{ mr: 1 }}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <FormatListNumberedIcon />
          </IconButton>

          <Divider
            sx={{ mr: 1, ml: 1 }}
            orientation="vertical"
            variant="middle"
            flexItem
          />

          <IconButton
            onClick={() => editor.chain().focus().unsetAllMarks().run()}
          >
            <FormatClearIcon />
          </IconButton>

          <IconButton
            onClick={() => editor.commands.undo()}
            disabled={!editor.can().chain().focus().undo().run()}
          >
            <UndoIcon />
          </IconButton>

          <IconButton
            onClick={() => editor.commands.redo()}
            disabled={!editor.can().chain().focus().redo().run()}
          >
            <RedoIcon />
          </IconButton>
        </ButtonGroup>
        <Divider />
      </>
    )
  );
};
