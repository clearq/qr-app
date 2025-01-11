import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const CDN_USERNAME = process.env.NEXT_PUBLIC_CDN_USERNAME;
const CDN_PASSWORD = process.env.NEXT_PUBLIC_CDN_PASSWORD;

// console.log("API_BASE_URL:", process.env.NEXT_PUBLIC_API_BASE_URL);
// console.log("CDN_USERNAME:", process.env.NEXT_PUBLIC_CDN_USERNAME);
// console.log("CDN_PASSWORD:", process.env.NEXT_PUBLIC_CDN_PASSWORD);


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

  
export const autoLoginToCDN = async () => {
    try {
      console.log("Attempting CDN login...");
      const response = await api.post(`${API_BASE_URL}/auth/login`, {
        username: CDN_USERNAME,
        password: CDN_PASSWORD,
      });
  
      console.log("Full login response:", response.data);
  
      // Directly use response.data as the token
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
  
  
  
  
  export const getImageUrl = (
    key,
    userId,
    contentFolder
  ) => {
    if (!key || !userId || !contentFolder) {
      console.error("Invalid parameters for getImageUrl:", {
        key,
        userId,
        contentFolder,
      });
      return null;
    }
  
    console.log(userId);
  
    const url = `${API_BASE_URL}/content/${userId}/${contentFolder}/${key}`;
    console.log("Generated CDN URL:", url);
    return url;
  };

// Function for logging in
export const loginUser = async (username, password) => {
  try {
    const response = await api.post('/auth/login', {
        username,
        password
      });
    return response.data;
  } catch (error) {
      throw error;
  }
};

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
                Authorization: `Bearer ${token}`,  // Ensure this token is valid
              },
            }
          );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getFile = async (key, token, userId, contentFolder) => {
    try {
        const response = await api.get(`/content/${userId}/${contentFolder}/${key}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            responseType: 'blob',
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const getPublicFile = async (key, token, userId, contentFolder) => {
    try {
        const response = await api.get(`/public/${userId}/${contentFolder}/${key}`, {
            responseType: 'blob',
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const deleteFile = async (key, token, userId, contentFolder) => {
    try {
        const response = await api.delete(`/content/${userId}/${contentFolder}/${key}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const invalidateCache = async (pattern, token, userId, contentFolder) => {
    try {
        const response = await api.delete(`/content/pattern/${userId}/${contentFolder}/${pattern}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};


export default api;