import { axiosInstance } from ".";
import type { SignInPayload, SignUpPayload, AuthResponse } from "../schemas/auth.schema";

interface RefreshTokenResponse {
  accessToken: string;
  data: {
    userId: string;
    name: string;
    email: string;
    roles: string[];
    permissions: string[];
  };
}

export const authApi = {
  signIn(data: SignInPayload) {
    return axiosInstance.post<SignInPayload, AuthResponse>("/auth/sign-in", data);
  },
  signUp(data: SignUpPayload) {
    return axiosInstance.post<SignUpPayload, AuthResponse>("/auth/sign-up", data);
  },
  refreshToken() {
    return axiosInstance.post<never, RefreshTokenResponse>("/auth/refresh-token");
  },
};
