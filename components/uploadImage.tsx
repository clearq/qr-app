"use client";
 
import { UploadButton } from "@/utils/uploadthing";
 
export default function ImageUpload() {
  return (
    <main className="flex flex-col items-center justify-between p-2">
      <UploadButton
      appearance={{
        button:{
          background: 'black',
        }
      }}
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          console.log("Files: ", res);
          alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          alert(`ERROR! ${error.message}`);
        }}
      />
    </main>
  );
}