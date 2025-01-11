"use client";

import React, { useState } from "react";
import RichTextEditor from "@/components/RichTextEditor";

const RichTextPage: React.FC = () => {
  const [savedContent, setSavedContent] = useState<string>("");

  const handleSave = (content: string) => {
    console.log("Saved Content:", content);
    setSavedContent(content);
    // Here, you would save `content` to the database via an API call
    // Example:
    // fetch("/api/save", { method: "POST", body: JSON.stringify({ content }) });
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Rich Text Editor</h1>
      <RichTextEditor initialContent={savedContent} onSave={handleSave} />
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Preview:</h2>
        <div
          className="prose border border-gray-300 p-4 rounded-md"
          dangerouslySetInnerHTML={{ __html: savedContent }}
        />
      </div>
    </div>
  );
};

export default RichTextPage;
