import { ButtonGroup, Divider, IconButton } from '@mui/material';
import { useCurrentEditor } from '@tiptap/react';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import FormatStrikethroughIcon from '@mui/icons-material/FormatStrikethrough';
import CodeIcon from '@mui/icons-material/Code';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';

export const MenuBar = () => {
  const { editor } = useCurrentEditor();

  return (
    editor && (
      <>
        <ButtonGroup sx={{ flexWrap: 'wrap' }}>
          <IconButton
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
            sx={{ color: 'black.main', mr: 1 }}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
          >
            H3
          </IconButton>

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

          <IconButton
            sx={{ mr: 1 }}
            onClick={() => editor.chain().focus().toggleCode().run()}
          >
            <CodeIcon />
          </IconButton>

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