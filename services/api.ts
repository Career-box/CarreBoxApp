import axios from "axios";
import Constants from "expo-constants";
import { Platform } from "react-native";

const getBaseUrl = () => {
  if (__DEV__) {
    // if (Platform.OS === "android") {
    //   return "http://10.0.2.2:5002"; // Android emulator localhost
    // } else if (Platform.OS === "ios") {
    //   return "http://localhost:5002"; // iOS simulator localhost
    // } else {
    //   // For Expo Go on physical devices
    //   return "http://localhost:5002";
    // }
    return "https://career-box.onrender.com";
  } else {
    return "https://career-box.onrender.com";
  }
};

const API_BASE_URL = getBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Set a timeout of 10 seconds
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(
      `API Response: ${response.status} ${response.config.url}`,
      response.data
    );
    return response;
  },
  (error) => {
    console.error(
      "API Response Error:",
      error.response ? error.response.data : error.message
    );
    return Promise.reject(error);
  }
);

export const register = (phoneNumber: string) => {
  return api.post("/auth/register", { phoneNumber });
};

export const verify = (phoneNumber: string, otp: string) => {
  return api.post("/auth/confirm-otp", { phoneNumber, otp });
};

export const createMpin = (token: string, pin: string) => {
  return api.post(
    "/api/user/create-pin",
    { pin },
    {
      headers: { Authorization: `${token}` },
    }
  );
};

export const logIn = (phoneNumber: string, mpin: string) => {
  return api.post("/auth/sign-in", { phoneNumber, mpin });
};

export const updateProfile = (
  token: string,
  userData: object,
  profileData: any
) => {
  return api.post("/api/user/profileDetails", profileData, {
    headers: { Authorization: `${token}`, user: `${userData}` },
  });
};

export const updateEducation = (token: string, educationData: any) => {
  return api.post("/api/user/educationDetails", educationData, {
    headers: { Authorization: `${token}` },
  });
};

export default api;
