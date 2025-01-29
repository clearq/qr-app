import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // Import the styles
import Quill from "quill";
import ImageResize from "quill-image-resize"; // Import the module
import "@/RichTextEditor.css"; // Import custom styles

// Register the image resize module
Quill.register("modules/imageResize", ImageResize);

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  disabled = false,
  className,
}) => {
  const [editorValue, setEditorValue] = useState(value);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleChange = (content: string) => {
    setEditorValue(content);
    onChange(content);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className={`rich-text-editor ${className}`}>
      <ReactQuill
        theme="snow"
        value={editorValue}
        onChange={handleChange}
        readOnly={disabled}
        modules={{
          toolbar: [
            // Font Style
            [{ font: [] }], // Font family
            [{ size: ["small", false, "large", "huge"] }], // Font sizes

            // Text Formatting
            ["bold", "italic", "underline", "strike"], // Bold, italic, underline, strike-through
            [{ script: "sub" }, { script: "super" }], // Subscript / Superscript

            // Text Alignment & Indentation
            [{ align: [] }], // Text alignment
            [{ indent: "-1" }, { indent: "+1" }], // Indentation

            // Text Color & Background
            [{ color: [] }, { background: [] }], // Text color and background color

            // Lists
            [{ list: "ordered" }, { list: "bullet" }], // Ordered and unordered lists
            [{ direction: "rtl" }], // Text direction (right-to-left)

            // Media Embeds
            ["link", "image", "video"], // Links, images, videos

            // Clear Formatting
            ["clean"], // Clear formatting
          ],
          imageResize: {
            modules: ["Resize", "DisplaySize"], // Ensure the resize module is active
          },
        }}
        formats={[
          "font",
          "size",
          "bold",
          "italic",
          "underline",
          "strike",
          "script",
          "align",
          "indent",
          "color",
          "background",
          "list",
          "direction",
          "blockquote",
          "code-block",
          "header",
          "link",
          "image",
          "video",
        ]}
        className="resizable-editor"
      />
    </div>
  );
};
