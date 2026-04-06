import axios from "axios";
import { store } from "../redux/store";
import { setUser, resetUser } from "../redux/user/userSlice";
import { toast } from 'sonner';
import { navigateTo } from "../App";
export { sellerApi } from "./sellerApi";
export { productsApi } from "./productsApi";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5050/api/v1",
  withCredentials: true,
});

const whiteList = ["/auth/sign-in", "/auth/sign-up", "/auth/refresh-token"];

axiosInstance.interceptors.request.use(
  function (config) {
    if (!config.url || !whiteList.includes(config.url)) {
      config.headers.Authorization = `Bearer ${localStorage.getItem("accessToken")}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

interface RefreshTokenData {
  accessToken: string;
  data: {
    userId: string;
    name: string;
    email: string;
    roles: string[];
    permissions: string[];
  };
}

axiosInstance.interceptors.response.use(
  function (response) {
    return response.data;
  },
  async function (error) {
    const errorMessage = error?.response?.data?.message;
    const originalRequest = error.config;

    if (errorMessage === "TOKEN_EXPIRED") {
      try {
        const resRT = await axiosInstance.post<never, RefreshTokenData>("/auth/refresh-token");
        const newAccessToken = resRT.accessToken;
        const userData = resRT.data;

        store.dispatch(
          setUser({
            isAuthenticated: true,
            accessToken: newAccessToken,
            user: userData,
          })
        );

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        // retry (send the prevoius failed request again)
        return axiosInstance(originalRequest);
      } catch {
        store.dispatch(resetUser());
        navigateTo('/auth');
        return Promise.reject(error);
      }
    }

    if (errorMessage === "TOKEN_INVALID" || errorMessage === "NO_TOKEN") {
      store.dispatch(resetUser());
      navigateTo('/auth');
      return Promise.reject(error);
    }
    toast.error(error?.response?.data?.message);
    console.log(error);
    return Promise.reject(error);
  }
);
