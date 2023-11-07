import { IconButton, Paper } from '@mui/material';
import { useCurrentEditor } from '@tiptap/react';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatStrikethroughIcon from '@mui/icons-material/FormatStrikethrough';
import CodeIcon from '@mui/icons-material/Code';

export const BubbleMenuOptions = () => {
  const { editor } = useCurrentEditor();

  return (
    editor && (
      <div>
        <Paper elevation={6}>
          <IconButton onClick={() => editor.chain().focus().toggleBold().run()}>
            <FormatBoldIcon />
          </IconButton>
          <IconButton
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
        </Paper>
      </div>
    )
  );
};
