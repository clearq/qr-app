import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const CDN_USERNAME = process.env.NEXT_PUBLIC_CDN_USERNAME;
const CDN_PASSWORD = process.env.NEXT_PUBLIC_CDN_PASSWORD;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
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
    console.error("CDN login failed:");
    throw error;
  }
};

// Generate Image URL
export const getImageUrl = (
  key: string,
  userId: string,
  contentFolder: string
): string => {
  if (!key || !userId || !contentFolder) {
    throw new Error("Invalid parameters for getImageUrl");
  }

  const url = `${API_BASE_URL}/Content/${userId}/${contentFolder}/${key}`;
  return url;
};

// Upload File to CDN
export const uploadFile = async (
  key: string,
  file: File,
  token: string,
  userId: string,
  contentFolder: string
) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(
      `${API_BASE_URL}/Content/${userId}/${contentFolder}/${key}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("File upload response:", response.data);
    return response.data;
  } catch (error) {
    console.error("File upload failed:", error);
    throw error;
  }
};

// Retrieve File from CDN
export const getFile = async (
  key: any,
  token: any,
  userId: any,
  contentFolder: any
) => {
  try {
    const response = await api.get(
      `/Content/${userId}/${contentFolder}/${key}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      }
    );
    console.log("File retrieval response:", response);
    return response;
  } catch (error) {
    console.error("File retrieval failed:");
    throw error;
  }
};

export default api;
