'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight } from 'lowlight';
import EditorToolbar from './EditorToolbar';
import { useEffect } from 'react';

interface BlogEditorProps {
  content?: string; // JSON string from Supabase
  placeholder?: string;
  onChange?: (content: string) => void; // Returns JSON string
  editable?: boolean;
  className?: string;
}

// Initialize lowlight with common languages
const lowlight = createLowlight();

export default function BlogEditor({
  content,
  placeholder = 'Start writing your blog post...',
  onChange,
  editable = true,
  className = '',
}: BlogEditorProps) {
  const editor = useEditor({
    immediatelyRender: false, // Prevent SSR hydration mismatches
    extensions: [
      StarterKit.configure({
        codeBlock: false, // Use CodeBlockLowlight instead
      }),
      Placeholder.configure({
        placeholder,
      }),
      CharacterCount,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-emerald-600 underline',
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Underline,
      Highlight.configure({
        multicolor: true,
      }),
      Color,
      TextStyle,
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content: content ? JSON.parse(content) : '',
    editable,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onChange?.(JSON.stringify(json));
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] px-6 py-4',
      },
    },
  });

  // Update editor content when prop changes (for loading existing posts)
  useEffect(() => {
    if (content && editor) {
      try {
        const parsed = JSON.parse(content);
        editor.commands.setContent(parsed);
      } catch (error) {
        // Failed to parse content - return empty string
      }
    }
  }, [content, editor]);

  if (!editor) {
    return (
      <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
        <div className="animate-pulse">Loading editor...</div>
      </div>
    );
  }

  const wordCount = editor.storage.characterCount?.words() || 0;
  const characterCount = editor.storage.characterCount?.characters() || 0;

  return (
    <div className={`border border-gray-300 rounded-lg bg-white ${className}`}>
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
      <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 bg-gray-50 rounded-b-lg text-sm text-gray-500">
        <div className="flex gap-4">
          <span>{wordCount} words</span>
          <span>{characterCount} characters</span>
        </div>
        <div className="text-xs text-gray-400">
          {editable ? 'Press / for commands' : 'Preview mode'}
        </div>
      </div>
    </div>
  );
}

