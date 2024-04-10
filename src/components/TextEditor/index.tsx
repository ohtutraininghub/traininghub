import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { MenuBar } from './MenuBar';
import { Box } from '@mui/material';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { DictProps } from '@/lib/i18n';
import ResizableImageExtension from './ResizeExtension';
import { useEffect } from 'react';

interface TEditorProps extends DictProps {
  value: string;
  onChange(_body: string): void;
}

const Tiptap = ({ lang, value, onChange }: TEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.extend({ inclusive: false }),
      Underline,
      ResizableImageExtension,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);
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
        {editor && (
          <>
            <MenuBar editor={editor} lang={lang} />
            <EditorContent editor={editor} />
          </>
        )}
      </Box>
    </>
  );
};

export default Tiptap;
