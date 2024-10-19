// 'use client';

// import { createPlateEditor, Plate, PlateContent, ParagraphPlugin } from '@udecode/plate-common/react';
// import { HeadingPlugin } from '@udecode/plate-heading/react';
// import { BlockquotePlugin } from '@udecode/plate-block-quote/react';
// import { HorizontalRulePlugin } from '@udecode/plate-horizontal-rule/react';
// import { LinkPlugin } from '@udecode/plate-link/react';
// import { ImagePlugin, MediaEmbedPlugin } from '@udecode/plate-media/react';
// import { TodoListPlugin } from '@udecode/plate-list/react';
// import { ExcalidrawPlugin } from '@udecode/plate-excalidraw/react';
// import { TogglePlugin } from '@udecode/plate-toggle/react';
// import { ColumnPlugin, ColumnItemPlugin } from '@udecode/plate-layout/react';
// import { MentionPlugin, MentionInputPlugin } from '@udecode/plate-mention/react';
// import { TablePlugin, TableRowPlugin, TableCellPlugin, TableCellHeaderPlugin } from '@udecode/plate-table/react';
// import { DatePlugin } from '@udecode/plate-date/react';
// import { CaptionPlugin } from '@udecode/plate-caption/react';
// import { BoldPlugin, ItalicPlugin, UnderlinePlugin, StrikethroughPlugin, CodePlugin, SubscriptPlugin, SuperscriptPlugin } from '@udecode/plate-basic-marks/react';
// import { FontColorPlugin, FontBackgroundColorPlugin, FontSizePlugin } from '@udecode/plate-font';
// import { HighlightPlugin } from '@udecode/plate-highlight/react';
// import { KbdPlugin } from '@udecode/plate-kbd/react';
// import { AlignPlugin } from '@udecode/plate-alignment';
// import { IndentPlugin } from '@udecode/plate-indent/react';
// import { IndentListPlugin } from '@udecode/plate-indent-list/react';
// import { LineHeightPlugin } from '@udecode/plate-line-height';
// import { AutoformatPlugin } from '@udecode/plate-autoformat/react';
// import { BlockSelectionPlugin } from '@udecode/plate-selection/react';
// import { DndPlugin } from '@udecode/plate-dnd';
// import { EmojiPlugin } from '@udecode/plate-emoji/react';
// import { ExitBreakPlugin, SoftBreakPlugin } from '@udecode/plate-break/react';
// import { NodeIdPlugin } from '@udecode/plate-node-id';
// import { ResetNodePlugin } from '@udecode/plate-reset-node/react';
// import { DeletePlugin } from '@udecode/plate-select';
// import { TabbablePlugin } from '@udecode/plate-tabbable/react';
// import { TrailingBlockPlugin } from '@udecode/plate-trailing-block';
// import { CommentsPlugin } from '@udecode/plate-comments/react';
// import { DocxPlugin } from '@udecode/plate-docx';
// import { CsvPlugin } from '@udecode/plate-csv';
// import { MarkdownPlugin } from '@udecode/plate-markdown';
// import { JuicePlugin } from '@udecode/plate-juice';
// import { HEADING_KEYS } from '@udecode/plate-heading';
// import { DndProvider } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';


// const editor = createPlateEditor({
//   plugins: [
//     ParagraphPlugin,
//     HeadingPlugin,
//     BlockquotePlugin,
//     HorizontalRulePlugin,
//     LinkPlugin.configure({
//       render: { afterEditable: () => <LinkFloatingToolbar /> },
//     }),
//     ImagePlugin,
//     TodoListPlugin,
//     ExcalidrawPlugin,
//     TogglePlugin,
//     ColumnPlugin,
//     MediaEmbedPlugin,
//     MentionPlugin,
//     TablePlugin,
//     DatePlugin,
//     CaptionPlugin.configure({
//       options: { plugins: [ImagePlugin, MediaEmbedPlugin] },
//     }),
//     BoldPlugin,
//     ItalicPlugin,
//     UnderlinePlugin,
//     StrikethroughPlugin,
//     CodePlugin,
//     SubscriptPlugin,
//     SuperscriptPlugin,
//     FontColorPlugin,
//     FontBackgroundColorPlugin,
//     FontSizePlugin,
//     HighlightPlugin,
//     KbdPlugin,
//     AlignPlugin.configure({
//       inject: { targetPlugins: ['p', 'h1', 'h2', 'h3'] },
//     }),
//     IndentPlugin.configure({
//       inject: { targetPlugins: ['p', 'h1', 'h2', 'h3'] },
//     }),
//     IndentListPlugin.configure({
//       inject: { targetPlugins: ['p', 'h1', 'h2', 'h3'] },
//     }),
//     LineHeightPlugin.configure({
//       inject: {
//         nodeProps: {
//           defaultNodeValue: 1.5,
//           validNodeValues: [1, 1.2, 1.5, 2, 3],
//         },
//         targetPlugins: ['p', 'h1', 'h2', 'h3'],
//       },
//     }),
//     AutoformatPlugin.configure({
//       options: {
//         enableUndoOnDelete: true,
//         rules: [
//           // Usage: https://platejs.org/docs/autoformat
//         ],
//       },
//     }),
//     BlockSelectionPlugin,
//     DndPlugin.configure({
//         options: { enableScroller: true },
//     }),
//     EmojiPlugin,
//     ExitBreakPlugin.configure({
//       options: {
//         rules: [
//           {
//             hotkey: 'mod+enter',
//           },
//           {
//             before: true,
//             hotkey: 'mod+shift+enter',
//           },
//           {
//             hotkey: 'enter',
//             level: 1,
//             query: {
//               allow: ['h1', 'h2', 'h3'],
//               end: true,
//               start: true,
//             },
//             relative: true,
//           },
//         ],
//       },
//     }),
//     NodeIdPlugin,
//     ResetNodePlugin.configure({
//       options: {
//         rules: [
//           // Usage: https://platejs.org/docs/reset-node
//         ],
//       },
//     }),
//     DeletePlugin,
//     SoftBreakPlugin.configure({
//       options: {
//         rules: [
//           { hotkey: 'shift+enter' },
//           {
//             hotkey: 'enter',
//             query: {
//               allow: ['code_block', 'blockquote', 'td', 'th'],
//             },
//           },
//         ],
//       },
//     }),
//     TabbablePlugin,
//     TrailingBlockPlugin.configure({
//       options: { type: 'p' },
//     }),
//     CommentsPlugin,
//     DocxPlugin,
//     CsvPlugin,
//     MarkdownPlugin,
//     JuicePlugin,
//   ],
//   override: {
//     components: ({
//     }),
//   },
//   value: [
//     {
//       id: "1",
//       type: "p",
//       children: [{ text: "Hello, World!" }],
//     },
//   ],
// });

// export function PlateEditor() {
//   return (
//     <DndProvider backend={HTML5Backend}>
//       <Plate editor={editor}>
//         <PlateContent />
//       </Plate>
//     </DndProvider>
//   );
// }

import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Typography from '@tiptap/extension-typography';
import Placeholder from '@tiptap/extension-placeholder';
import { Button } from '@/components/ui/button';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Heading2,
  Heading3,
  Undo,
  Redo,
} from 'lucide-react';

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Button
        size="icon"
        variant="outline"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'bg-accent' : ''}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant="outline"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'bg-accent' : ''}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant="outline"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'bg-accent' : ''}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant="outline"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'bg-accent' : ''}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant="outline"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'bg-accent' : ''}
      >
        <Quote className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant="outline"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'bg-accent' : ''}
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant="outline"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive('heading', { level: 3 }) ? 'bg-accent' : ''}
      >
        <Heading3 className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant="outline"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        <Undo className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant="outline"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        <Redo className="h-4 w-4" />
      </Button>
    </div>
  );
};

const RichTextEditor = ({ initialContent, onContentChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Typography,
      Placeholder.configure({
        placeholder: 'Start writing your article...',
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="min-h-[300px] border rounded-md p-4" />
    </div>
  );
};

export default RichTextEditor;
