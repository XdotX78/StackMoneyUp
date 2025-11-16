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

/**
 * Check if content is valid JSON (TipTap format) or HTML/Markdown
 */
function isJsonContent(content: string): boolean {
  if (!content || content.trim().length === 0) return false;
  
  // Check if it starts with JSON-like structure
  const trimmed = content.trim();
  
  // Must start with { and end with } to be JSON
  if (!trimmed.startsWith('{') || !trimmed.endsWith('}')) {
    return false;
  }
  
  // Try to parse as JSON
  try {
    const parsed = JSON.parse(content);
    // Additional check: TipTap JSON should have a type property
    return typeof parsed === 'object' && (parsed.type === 'doc' || parsed.type === 'paragraph' || Array.isArray(parsed.content));
  } catch {
    return false;
  }
}

export default function BlogEditor({
  content,
  placeholder = 'Start writing your blog post...',
  onChange,
  editable = true,
  className = '',
}: BlogEditorProps) {
  // Determine initial content format - only parse JSON, leave HTML as-is
  const getInitialContent = () => {
    if (!content) return '';
    
    // Only parse if it's valid JSON (TipTap format)
    if (isJsonContent(content)) {
      try {
        return JSON.parse(content);
      } catch {
        // If JSON parsing fails, return empty - will be set via useEffect
        return '';
      }
    }
    
    // For HTML/Markdown, return empty initially - will be set via useEffect
    // This prevents TipTap from trying to parse it during initialization
    return '';
  };

  const editor = useEditor({
    immediatelyRender: false, // Prevent SSR hydration mismatches
    extensions: [
      StarterKit.configure({
        codeBlock: false, // Use CodeBlockLowlight instead
        link: false, // Use custom Link extension instead
        underline: false, // Use custom Underline extension instead
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
    content: getInitialContent(),
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

  // Set content after editor is created (handles both JSON and HTML/Markdown)
  useEffect(() => {
    if (!editor) return;
    
    if (content) {
      // First check if it's valid JSON before attempting to parse
      if (isJsonContent(content)) {
        // Content is JSON (TipTap format)
        try {
          const parsed = JSON.parse(content);
          editor.commands.setContent(parsed);
        } catch (error) {
          console.error('Failed to parse JSON content:', error);
          // If JSON parsing fails, try treating it as HTML/Markdown
          try {
            editor.commands.setContent(content);
          } catch (fallbackError) {
            console.error('Failed to set content as HTML/Markdown:', fallbackError);
            editor.commands.setContent('');
          }
        }
      } else {
        // Content is HTML/Markdown - TipTap can parse it directly as HTML string
        try {
          // TipTap's setContent can accept HTML strings directly
          // For markdown, we need to convert it to HTML first or let TipTap handle it
          editor.commands.setContent(content);
        } catch (error) {
          console.error('Failed to set HTML/Markdown content:', error);
          // If setting content fails, try creating a simple paragraph
          try {
            editor.commands.setContent({
              type: 'doc',
              content: [{
                type: 'paragraph',
                content: [{ type: 'text', text: content }]
              }]
            });
          } catch (finalError) {
            console.error('Failed to set content as text:', finalError);
            editor.commands.setContent('');
          }
        }
      }
    } else {
      // Clear content if no content provided
      editor.commands.setContent('');
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

