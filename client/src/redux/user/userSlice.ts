import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
// Define a type for the slice state
export interface UserState {
  isAuthenticated: boolean;
  accessToken: string;
  user: any;
}

// Define the initial state using that type
const initialState: UserState = {
  isAuthenticated: Boolean(localStorage.getItem("isAuthenticated")) || false,
  accessToken: localStorage.getItem("accessToken") || "",
  user: JSON.parse(localStorage.getItem("user") || "null"),
};

export const userSlice = createSlice({
  name: "user",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setUser: (state, payload: PayloadAction<UserState>) => {
      state.isAuthenticated = payload.payload.isAuthenticated;
      state.accessToken = payload.payload.accessToken;
      state.user = payload.payload.user;

      localStorage.setItem("isAuthenticated", String(state.isAuthenticated));
      localStorage.setItem("accessToken", state.accessToken);
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    resetUser: (state) => {
      state.isAuthenticated = false;
      state.accessToken = "";
      state.user = null;

      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    },
  },
});

export const { setUser, resetUser } = userSlice.actions;

export default userSlice.reducer;
