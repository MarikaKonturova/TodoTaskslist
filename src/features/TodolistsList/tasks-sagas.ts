import { AxiosError, AxiosResponse } from "axios";
import {
  call,
  put,
  PutEffect,
  takeEvery,
} from "redux-saga/effects";
import {
  GetTasksResponse,
  TaskType,
  todolistsAPI,
  ResponseType,
  UpdateTaskModelType,
} from "../../api/todolists-api";
import { setAppStatusAC } from "../../app/app-reducer";
import { store } from "../../app/store";
import {
  handleServerAppErrorSaga,
  handleServerNetworkErrorSaga,
} from "../../utils/error-utils";
import {
  addTaskAC,
  removeTaskAC,
  setTasksAC,
  UpdateDomainTaskModelType,
  updateTaskAC,
} from "./tasks-reducer";
export function* fetchTasksSaga({ todolistId, type }: ReturnType<typeof fetchTasks>) {
  yield put(setAppStatusAC("loading"));
  const data: GetTasksResponse = yield call(
    todolistsAPI.getTasks,
    todolistId
  );
  const tasks = data.items;
  yield put(setTasksAC(tasks, todolistId));
  yield put(setAppStatusAC("succeeded"));
}
export const fetchTasks = (todolistId: string) => {
  console.log("triggered");

  return {
    type: "TASKS/FETCH_TASKS",
    todolistId,
  };
};

export function* removeTaskSaga({
  taskId,
  todolistId,
}: ReturnType<typeof removeTask>) {
  yield call(todolistsAPI.deleteTask, todolistId, taskId);
  const action = removeTaskAC(taskId, todolistId);
  yield put(action);
}

export const removeTask = (taskId: string, todolistId: string) => ({
  type: "TASKS/REMOVE_TASK",
  taskId,
  todolistId,
});

function* addTaskSaga({ title, todolistId }: ReturnType<typeof addTask>) {
  put(setAppStatusAC("loading"));

  try {
    const res: AxiosResponse<ResponseType<{ item: TaskType }>> = yield call(
      todolistsAPI.createTask,
      todolistId,
      title
    );
    console.log(res);
    if (res.data.resultCode === 0) {
      const task = res.data.data.item;
      const action = addTaskAC(task);
      yield put(action);
      yield put(setAppStatusAC("succeeded"));
    } else {
      yield handleServerAppErrorSaga(res.data);
    }
  } catch (error) {
    yield handleServerNetworkErrorSaga(error as AxiosError);
  }
}
export const addTask = (title: string, todolistId: string) => ({
  type: "TASKS/ADD_TASK",
  title,
  todolistId,
});

function* updateTaskSaga({
  taskId,
  domainModel,
  todolistId,
}: ReturnType<typeof updateTask>) {
  const state = store.getState();
  const task = state.tasks[todolistId].find((t) => t.id === taskId);
  if (!task) {
    //throw new Error("task not found in the state");
    console.warn("task not found in the state");
    return;
  }

  const apiModel: UpdateTaskModelType = {
    deadline: task.deadline,
    description: task.description,
    priority: task.priority,
    startDate: task.startDate,
    title: task.title,
    status: task.status,
    ...domainModel,
  };

  try {
    const res: AxiosResponse<ResponseType<TaskType>> = yield call(
      todolistsAPI.updateTask,
      todolistId,
      taskId,
      apiModel
    );

    if (res.data.resultCode === 0) {
      console.log("success");
      const action = updateTaskAC(taskId, domainModel, todolistId);
      yield put(action);
    } else {
      yield handleServerAppErrorSaga(res.data);
    }
  } catch (error) {
    yield handleServerNetworkErrorSaga(error as AxiosError);
  }
}

export const updateTask = (
  taskId: string,
  domainModel: UpdateDomainTaskModelType,
  todolistId: string
) => ({
  type: "TASKS/UPDATE_TASK",
  taskId,
  domainModel,
  todolistId,
});

export function* tasksSaga() {
  yield takeEvery("TASKS/FETCH_TASKS", fetchTasksSaga);
  yield takeEvery("TASKS/REMOVE_TASK", removeTaskSaga);
  yield takeEvery("TASKS/ADD_TASK", addTaskSaga);
  yield takeEvery("TASKS/UPDATE_TASK", updateTaskSaga);
}
