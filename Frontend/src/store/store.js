import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../Redux/AuthSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
