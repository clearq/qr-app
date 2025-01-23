import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const CDN_USERNAME = process.env.NEXT_PUBLIC_CDN_USERNAME;
const CDN_PASSWORD = process.env.NEXT_PUBLIC_CDN_PASSWORD;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// CDN Login
export const autoLoginToCDN = async () => {
  try {
    console.log("Attempting CDN login...");
    const response = await api.post(`${API_BASE_URL}/auth/login`, {
      username: CDN_USERNAME,
      password: CDN_PASSWORD,
    });

    console.log("Full login response:", response.data);

    const token = response.data; // The API returns the raw token string
    if (!token) {
      throw new Error("CDN login failed: Missing token.");
    }

    localStorage.setItem("cdnToken", token);
    console.log("Token successfully saved:", token);

    return token;
  } catch (error) {
    console.error("CDN login failed:", error.message);
    throw error;
  }
};

// Generate Image URL
export const getImageUrl = (key, userId, contentFolder) => {
  if (!key || !userId || !contentFolder) {
    console.error("Invalid parameters for getImageUrl:", {
      key,
      userId,
      contentFolder,
    });
    return null;
  }

  const url = `${API_BASE_URL}/content/${userId}/${contentFolder}/${key}`;
  return url;
};

// Upload File to CDN
export const uploadFile = async (key, file, token, userId, contentFolder) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(
      `${API_BASE_URL}/content/${userId}/${contentFolder}/${key}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("File upload response:", response.data);
    return response.data;
  } catch (error) {
    console.error("File upload failed:", error.message);
    throw error;
  }
};

// Retrieve File from CDN
export const getFile = async (key, token, userId, contentFolder) => {
  try {
    const response = await api.get(`/content/${userId}/${contentFolder}/${key}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob',
    });
    console.log("File retrieval response:", response);
    return response;
  } catch (error) {
    console.error("File retrieval failed:", error.message);
    throw error;
  }
};

export default api;