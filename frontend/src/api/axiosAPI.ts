import axios from "axios";

let memoryAccessToken: string | null = null;

const API = axios.create({
  baseURL: "http://localhost:5000/api", 
  withCredentials: true, // Sends HttpOnly cookies (where your refresh token lives) automatically
  headers: {
    "Content-Type": "application/json", 
  },
});

API.interceptors.request.use((config) => {
  if (memoryAccessToken) {
    config.headers.Authorization = `Bearer ${memoryAccessToken}`;
  }
  return config;
});


API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const errorStatus = error.response?.status;
    const errorMessage = error.response?.data?.message;


    const isTokenExpired = 
      errorStatus === 401 || 
      (errorStatus === 403 && errorMessage === "Invalid or Expired Token");

    if (isTokenExpired && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent infinite loop tracking loops

      try {

        const res = await axios.post(
          "http://localhost:5000/api/auth/refresh", 
          {}, 
          { withCredentials: true }
        );
        
        const { accessToken } = res.data;
        memoryAccessToken = accessToken; // Set updated key reference inside runtime cache memory


        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return API(originalRequest);
      } catch (refreshError) {

        memoryAccessToken = null;
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const setAuthTokenInMemory = (token: string) => {
  memoryAccessToken = token;
};

export const clearAuthTokenInMemory = () => {
  memoryAccessToken = null;
};

export default API;