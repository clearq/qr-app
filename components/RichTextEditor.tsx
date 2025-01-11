"use client";

import React, { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button"; // Assuming you use Shadcn/UI buttons

interface RichTextEditorProps {
  initialContent?: string;
  onSave: (content: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  initialContent = "",
  onSave,
}) => {
  const [content, setContent] = useState(initialContent);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start writing here...",
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setContent(html);
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="border border-gray-300 rounded-md p-4">
        <EditorContent editor={editor} className="prose" />
      </div>
      <Button
        onClick={() => onSave(content)}
        className="w-full bg-primary text-white"
      >
        Save Content
      </Button>
    </div>
  );
};

export default RichTextEditor;
