import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (__DEV__) {
      console.log(`\n[REQUEST] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);

      if (config.data) {
        try {
          console.log("Payload:", JSON.stringify(config.data, null, 2));
        } catch (e) {
          console.log("Payload:", config.data);
        }
      } else {
        console.log("Payload: (vazio)");
      }
    }

    return config;
  },
  (error) => {
    if (__DEV__) {
      console.error("[REQUEST ERROR]", error);
    }
    return Promise.reject(error);
  }
);
