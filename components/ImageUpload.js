// ImageUpload.js
import React, { useState } from 'react';
import ImageUploader from 'react-image-upload';
import 'react-image-upload/dist/index.css';

const ImageUpload = ({ onImageUpload }) => {
  const handleImageUpload = (imageFile) => {
    // Convert the image to a data URL
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageDataUrl = reader.result;
      // Pass the image data URL to the parent component
      onImageUpload(imageDataUrl);
    };
    reader.readAsDataURL(imageFile);
  };

  return (
    <ImageUploader
      onFileAdded={handleImageUpload}
      onFileRemoved={() => onImageUpload(null)}
    />
  );
};

export default ImageUpload;
