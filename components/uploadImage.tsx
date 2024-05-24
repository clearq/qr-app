import axios from 'axios';

interface UploadResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

const uploadImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const base64Data = reader.result as string;
          // Here, you can save the base64Data to your database or perform any other actions
          resolve(base64Data);
        };
        reader.onerror = (error) => {
          reject(error);
        };
      } catch (error) {
        reject(error);
      }
    });
  };

export default uploadImage;
