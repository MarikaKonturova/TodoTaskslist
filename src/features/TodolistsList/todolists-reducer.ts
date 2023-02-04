import { todolistsAPI } from "../../api/todolists-api";
import { RequestStatusType } from "../Application/application-reducer";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { appActions } from "../CommonActions/App";
import { TodolistType } from "../../api/types";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../../utils/error-utils";
import { ThunkError } from "../../utils/types";
import { AxiosError } from "axios";

const { setAppStatus } = appActions;
export const fetchTodolists = createAsyncThunk<
  { todolists: TodolistType[] },
  undefined,
  ThunkError
>("todolist/fetchTodolists", async (_, thunkAPI) => {
  thunkAPI.dispatch(setAppStatus({ status: "loading" }));
  try {
    const res = await todolistsAPI.getTodolists();
    const todolists = res.data;
    thunkAPI.dispatch(setAppStatus({ status: "succeeded" }));
    return { todolists };
  } catch (error) {
    handleServerNetworkError(error as AxiosError, thunkAPI);
    return thunkAPI.rejectWithValue({
      errors: ["Some error occurred"],
    });
  }
});
export const removeTodolist = createAsyncThunk<
  { id: string },
  string,
  ThunkError
>("todolist/removeTodolist", async (todolistId, thunkAPI) => {
  try {
    thunkAPI.dispatch(setAppStatus({ status: "loading" }));
    thunkAPI.dispatch(
      changeTodolistEntityStatus({ id: todolistId, status: "loading" })
    );
    const res = todolistsAPI.deleteTodolist(todolistId);
    thunkAPI.dispatch(setAppStatus({ status: "succeeded" }));
    return { id: todolistId };
  } catch (error) {
    handleServerNetworkError(error as AxiosError, thunkAPI, false);
    return thunkAPI.rejectWithValue({
      errors: ["Some error occurred"],
    });
  }
});
export const addTodolist = createAsyncThunk<
  { todolist: TodolistType },
  string,
  ThunkError
>("todolist/addTodolist", async (title, thunkAPI) => {
  thunkAPI.dispatch(setAppStatus({ status: "loading" }));
  try {
    const res = await todolistsAPI.createTodolist(title);
    if (res.data.resultCode === 0) {
      thunkAPI.dispatch(setAppStatus({ status: "succeeded" }));
      return { todolist: res.data.data.item };
    } else {
      handleServerAppError(res.data, thunkAPI, false);
      return thunkAPI.rejectWithValue({
        errors: ["Error with adding todolist"],
      });
    }
  } catch (error) {
    handleServerNetworkError(error as AxiosError, thunkAPI, false);
    return thunkAPI.rejectWithValue({
      errors: ["Some error occurred"],
    });
  }
});
export const changeTodolistTitle = createAsyncThunk<
  { id: string; title: string },
  { id: string; title: string },
  ThunkError
>("todolist/ changeTodolistTitle", async (param, thunkAPI) => {
  try {
    const res = await todolistsAPI.updateTodolist(param.id, param.title);
    if (res.data.resultCode === 0) {
      return param;
    } else {
      handleServerAppError(res.data, thunkAPI);
      return thunkAPI.rejectWithValue({
        errors: ["Error with updating todolist"],
      });
    }
  } catch (error) {
    handleServerNetworkError(error as AxiosError, thunkAPI, false);
    return thunkAPI.rejectWithValue({
      errors: ["Some error occurred"],
    });
  }
});

export const asyncActions = {
  fetchTodolists,
  removeTodolist,
  addTodolist,
  changeTodolistTitle,
};

export const slice = createSlice({
  name: "todolist",
  initialState: [] as Array<TodolistDomainType>,
  reducers: {
    changeTodolistFilter(
      state,
      action: PayloadAction<{ id: string; filter: FilterValuesType }>
    ) {
      const index = state.findIndex((tl) => tl.id === action.payload.id);
      state[index].filter = action.payload.filter;
    },
    changeTodolistEntityStatus(
      state,
      action: PayloadAction<{ id: string; status: RequestStatusType }>
    ) {
      const index = state.findIndex((tl) => tl.id === action.payload.id);
      state[index].entityStatus = action.payload.status;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTodolists.fulfilled, (state, action) => {
      return action.payload.todolists.map((tl) => ({
        ...tl,
        filter: "all",
        entityStatus: "idle",
      }));
    });
    builder.addCase(removeTodolist.fulfilled, (state, action) => {
      const index = state.findIndex((tl) => (tl.id = action.payload.id));
      if (index > -1) {
        state.splice(index, 1);
      }
    });
    builder.addCase(addTodolist.fulfilled, (state, action) => {
      state.unshift({
        ...action.payload.todolist,
        filter: "all",
        entityStatus: "idle",
      });
    });
    builder.addCase(changeTodolistTitle.fulfilled, (state, action) => {
      const index = state.findIndex((tl) => tl.id === action.payload.id);
      state[index].title = action.payload.title;
    });
  },
});

export const { changeTodolistEntityStatus, changeTodolistFilter } =
  slice.actions;
// types

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};
