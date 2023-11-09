import { EditorProvider } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { MenuBar } from './MenuBar';
import { Box } from '@mui/material';

type TEditorProps = {
  value: string;
  onChange(_body: string): void;
};

// define your extension array
const extensions = [StarterKit];

const Tiptap = ({ value, onChange }: TEditorProps) => {
  return (
    <>
      <Box
        sx={{
          backgroundColor: 'surface.light',
          border: 1,
          borderColor: 'surface.dark',
          borderRadius: 1,
          ':hover': {
            borderColor: 'black.main',
          },
          '.ProseMirror': {
            ml: 1,
            mr: 1,
            mt: -1,
          },
          '.ProseMirror:focus': {
            outline: 'none',
          },
        }}
      >
        <EditorProvider
          slotBefore={<MenuBar />}
          extensions={extensions}
          content={value}
          onUpdate={({ editor }) => onChange(editor.getHTML())}
        >
          {/* <BubbleMenu>
            <BubbleMenuOptions />
          </BubbleMenu> */}
        </EditorProvider>
      </Box>
    </>
  );
};

export default Tiptap;