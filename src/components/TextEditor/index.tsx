import { EditorProvider } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { MenuBar } from './MenuBar';
import { Box } from '@mui/material';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { DictProps } from '@/lib/i18n';
import ResizableImageExtension from './ResizeExtension';

interface TEditorProps extends DictProps {
  value: string;
  onChange(_body: string): void;
}

const extensions = [
  StarterKit,
  Link.extend({ inclusive: false }),
  Underline,
  ResizableImageExtension,
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
];

const Tiptap = ({ lang, value, onChange }: TEditorProps) => {
  return (
    <>
      <Box
        sx={{
          backgroundColor: 'surface.main',
          border: 1,
          borderColor: 'surface.dark',
          borderRadius: 1,
          ':hover': {
            borderColor: 'black.main',
          },
          ':focus-within': {
            borderColor: 'secondary.main',
            outlineColor: 'secondary.main',
            outlineStyle: 'solid',
            outlineWidth: 1,
          },
          '.ProseMirror': {
            ml: 1,
            mr: 1,
            mt: -1,
            overflowX: 'auto',
          },
          '.ProseMirror:focus': {
            outline: 'none',
          },
        }}
      >
        <EditorProvider
          slotBefore={<MenuBar lang={lang} />}
          extensions={extensions}
          content={value}
          onUpdate={({ editor }) => onChange(editor.getHTML())}
        >
          <></>
        </EditorProvider>
      </Box>
    </>
  );
};

export default Tiptap;
