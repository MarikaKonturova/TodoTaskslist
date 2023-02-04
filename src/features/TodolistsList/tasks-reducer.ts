import { todolistsAPI } from "../../api/todolists-api";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../../utils/error-utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addTodolist,
  fetchTodolists,
  removeTodolist,
} from "./todolists-reducer";
import { appActions } from "../CommonActions/App";
import { AppRootStateType, ThunkError } from "../../utils/types";
import { AxiosError } from "axios";
import {
  TaskPriorities,
  TaskStatuses,
  TaskType,
  TodolistType,
  UpdateTaskModelType,
} from "../../api/types";

const initialState: TasksStateType = {};

export const fetchTasks = createAsyncThunk<
  { tasks: TaskType[]; todolistId: string },
  string,
  ThunkError
>("tasks/fetchTasks", async (todolistId, thunkAPI) => {
  try {
    thunkAPI.dispatch(appActions.setAppStatus({ status: "loading" }));
    const res = await todolistsAPI.getTasks(todolistId);
    const tasks = res.data.items;
    thunkAPI.dispatch(appActions.setAppStatus({ status: "succeeded" }));
    return { tasks, todolistId };
  } catch (error) {
    handleServerNetworkError(error as AxiosError, thunkAPI);
    return thunkAPI.rejectWithValue({
      errors: ["Some error occurred"],
    });
  }
});
export const removeTask = createAsyncThunk<
  { todolistId: string; taskId: string },
  { todolistId: string; taskId: string },
  ThunkError
>("tasks/removeTask", async (param, thunkAPI) => {
  const res = await todolistsAPI.deleteTask(param.todolistId, param.taskId);
  return { todolistId: param.todolistId, taskId: param.taskId };
});
export const addTask = createAsyncThunk<
  TaskType,
  { title: string; todolistId: string },
  ThunkError
>("tasks/addTask", async (param, thunkAPI) => {
  thunkAPI.dispatch(appActions.setAppStatus({ status: "loading" }));
  try {
    const res = await todolistsAPI.createTask(param.todolistId, param.title);
    if (res.data.resultCode === 0) {
      thunkAPI.dispatch(appActions.setAppStatus({ status: "succeeded" }));
      const task = res.data.data.item;
      return task;
    } else {
      handleServerAppError(res.data, thunkAPI, false);
      return thunkAPI.rejectWithValue({
        errors: ["Error create task"],
      });
    }
  } catch (error) {
    handleServerNetworkError(error as AxiosError, thunkAPI, false);
    return thunkAPI.rejectWithValue({
      errors: ["Some error occurred"],
    });
  }
});

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async (
    param: {
      taskId: string;
      domainModel: UpdateDomainTaskModelType;
      todolistId: string;
    },
    thunkAPI
  ) => {
    const state = thunkAPI.getState() as AppRootStateType;
    const task = state.tasks[param.todolistId].find(
      (t: TaskType) => t.id === param.taskId
    );
    if (!task) {
      return thunkAPI.rejectWithValue("task not found in the state");
    }
    const apiModel: UpdateTaskModelType = {
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      title: task.title,
      status: task.status,
      ...param.domainModel,
    };
    const res = await todolistsAPI.updateTask(
      param.todolistId,
      param.taskId,
      apiModel
    );
    try {
      if (res.data.resultCode === 0) {
        return param;
      } else {
        handleServerAppError(res.data, thunkAPI);
        return thunkAPI.rejectWithValue({
          errors: ["Error with updating task"],
        });
      }
    } catch (error) {
      handleServerNetworkError(error as AxiosError, thunkAPI);
      return thunkAPI.rejectWithValue({
        errors: ["Some error occurred"],
      });
    }
  }
);

export const asyncActions = {
  fetchTasks,
  removeTask,
  addTask,
  updateTask,
};

export const slice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addTodolist.fulfilled, (state, action) => {
      state[action.payload.todolist.id] = [];
    });
    builder.addCase(removeTodolist.fulfilled, (state, action) => {
      delete state[action.payload.id];
    });
    builder.addCase(fetchTodolists.fulfilled, (state, action) => {
      action.payload.todolists.forEach((tl: TodolistType) => {
        state[tl.id] = [];
      });
    });
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state[action.payload.todolistId] = action.payload.tasks;
    });
    builder.addCase(removeTask.fulfilled, (state, action) => {
      const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex((t) => t.id === action.payload.taskId);
      if (index > -1) {
        tasks.splice(index, 1);
      }
    });
    builder.addCase(addTask.fulfilled, (state, action) => {
      state[action.payload.todoListId].unshift(action.payload);
    });
    builder.addCase(updateTask.fulfilled, (state, action) => {
      const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex((t) => t.id === action.payload.taskId);
      if (index > -1) {
        tasks[index] = { ...tasks[index], ...action.payload.domainModel };
      }
    });
  },
});


export type UpdateDomainTaskModelType = {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};
export type TasksStateType = {
  [key: string]: Array<TaskType>;
};
