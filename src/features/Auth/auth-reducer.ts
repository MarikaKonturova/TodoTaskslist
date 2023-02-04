import { authAPI } from "../../api/todolists-api";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../../utils/error-utils";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserLoginType } from "../../api/types";
import { appActions } from "../CommonActions/App";
import { ThunkError } from "../../utils/types";
import { AxiosError } from "axios";

const initialState = {
  isLoggedIn: false,
};
const { setAppStatus } = appActions;

// thunks
export const login = createAsyncThunk<
  { idLoggedIn: boolean },
  UserLoginType,
  ThunkError
>("auth/login", async (param, thunkAPI): Promise<any> => {
  thunkAPI.dispatch(setAppStatus({ status: "loading" }));
  try {
    const res = await authAPI.login(param);
    if (res.data.resultCode === 0) {
      thunkAPI.dispatch(setAppStatus({ status: "succeeded" }));
    } else {
      handleServerAppError(res.data, thunkAPI);
      return thunkAPI.rejectWithValue({
        errors: res.data.messages,
        fieldsErrors: res.data.fieldsErrors,
      });
    }
  } catch (error) {
    handleServerNetworkError(error as AxiosError, thunkAPI);
    return thunkAPI.rejectWithValue({
      errors: [(error as AxiosError).message],
      fieldsErrors: undefined,
    });
  }
});

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  thunkAPI.dispatch(setAppStatus({ status: "loading" }));
  const res = await authAPI.delete();
  try {
    if (res.data.resultCode === 0) {
      thunkAPI.dispatch(setAppStatus({ status: "succeeded" }));
      return;
    } else {
      handleServerAppError(res.data, thunkAPI);
    }
  } catch (error) {
    handleServerNetworkError(error as AxiosError, thunkAPI);
  }
});

export const asyncActions = {
  login,
  logout,
};

export const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
      state.isLoggedIn = action.payload.value;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoggedIn = true;
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      state.isLoggedIn = false;
    });
  },
});
