import { authAPI } from "../../api/todolists-api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { appActions } from "../CommonActions/App";
import { authActions } from "../Auth";

export const initializeApp = createAsyncThunk(
  "app/intializeApp",
  async (_, { dispatch }) => {
    const res = await authAPI.me();
    if (res.data.resultCode === 0) {
      dispatch(authActions.setIsLoggedInAC({ value: true }));
    } else {
      dispatch(authActions.setIsLoggedInAC({ value: false }));
    }
  }
);

export const asyncActions = {
  initializeApp,
};

export const slice = createSlice({
  name: "app",
  initialState: {
    status: "idle" as RequestStatusType,
    error: null as string | null,
    isInitialized: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(initializeApp.fulfilled, (state, action) => {
        state.isInitialized = true;
      })
      .addCase(initializeApp.rejected, (state) => {
        state.isInitialized = true;
      })
      .addCase(appActions.setAppError, (state, action) => {
        state.error = action.payload.error;
      })
      .addCase(appActions.setAppStatus, (state, action) => {
        state.status = action.payload.status;
      });
  },
});

//types
export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";
export type InitialStateType = {
  // status of interaction with server
  status: RequestStatusType;
  // global error
  error: string | null;
  // true when application is initialized
  isInitialized: boolean;
};
