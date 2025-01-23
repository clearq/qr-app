import React from 'react';

function MediaPreview({ retrievedFile, fileKey }) {
  if (!retrievedFile) {
    return null;
  }

  const fileExtension = fileKey ? fileKey.split('.').pop().toLowerCase() : null;
  let mediaElement;

  switch (fileExtension) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      mediaElement = (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="preview-img"
          src={retrievedFile}
          alt="Retrieved"
        />
      );
      break;
    case 'mp4':
    case 'webm':
    case 'ogg':
      mediaElement = (
        <video controls className="preview-video">
          <source src={retrievedFile} type={`video/${fileExtension}`} />
          Your browser does not support the video tag.
        </video>
      );
      break;
    case 'mp3':
    case 'wav':
    case 'aac':
      mediaElement = (
        <audio controls className="preview-audio">
          <source src={retrievedFile} type={`audio/${fileExtension}`} />
          Your browser does not support the audio element.
        </audio>
      );
      break;
    case 'pdf':
      mediaElement = (
        <embed
          src={retrievedFile}
          type="application/pdf"
          className="preview-pdf"
        />
      );
      break;
    default:
      mediaElement = (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="preview-img"
          src={retrievedFile}
          alt="Retrieved"
        />
      );
  }

  return (
    <div className="preview-container">
      {mediaElement}
    </div>
  );
}

export default MediaPreview;