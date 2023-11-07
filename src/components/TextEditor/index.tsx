import { EditorProvider } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { MenuBar } from './MenuBar';
import { Box } from '@mui/material';

// define your extension array
const extensions = [StarterKit];

const content =
  '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sed lorem in ipsum tempor pellentesque. Nam id velit venenatis, lacinia nunc ac, sagittis ex. In rhoncus nisi eu dignissim molestie. Duis vestibulum mauris sem, eu convallis nisl tincidunt sit amet. Nulla viverra iaculis neque quis scelerisque. Proin non sem egestas, semper dui non, mattis nisl. Suspendisse tempor dui ipsum, vehicula sagittis erat pellentesque in. Interdum et malesuada fames ac ante ipsum primis in faucibus.</p>';

const Tiptap = () => {
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
          content={content}
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
