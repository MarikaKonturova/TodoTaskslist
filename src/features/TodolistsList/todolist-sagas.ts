import { call, put } from "redux-saga/effects";
import { takeEvery } from "redux-saga/effects";
import {
  todolistsAPI,
  TodolistType,
  ResponseType,
} from "../../api/todolists-api";
import { setAppStatusAC } from "../../app/app-reducer";
import {
  addTodolistAC,
  changeTodolistEntityStatusAC,
  changeTodolistTitleAC,
  removeTodolistAC,
  setTodolistsAC,
} from "./todolists-reducer";
import { AxiosResponse } from "axios";

function* fetchTodolistsSaga() {
  yield put(setAppStatusAC("loading"));
  const res: AxiosResponse<TodolistType[]> = yield call(
    todolistsAPI.getTodolists
  );
  yield put(setTodolistsAC(res.data));
  yield put(setAppStatusAC("succeeded"));
}
export const fetchTodolists = () => ({
  type: "TODOLISTS/FETCH_TODOLISTS",
});

function* removeTodolistSaga({
  todolistId,
}: ReturnType<typeof removeTodolist>) {
  yield put(setAppStatusAC("loading"));
  yield put(changeTodolistEntityStatusAC(todolistId, "loading"));
  yield call(todolistsAPI.deleteTodolist, todolistId);
  yield put(removeTodolistAC(todolistId));
  yield put(setAppStatusAC("succeeded"));
}
export const removeTodolist = (todolistId: string) => ({
  type: "TODOLISTS/REMOVE_TODOLIST",
  todolistId,
});

function* addTodolistSaga({ title }: ReturnType<typeof addTodolist>) {
  yield put(setAppStatusAC("loading"));
  const res: AxiosResponse<ResponseType<{ item: TodolistType }>> = yield call(
    todolistsAPI.createTodolist,
    title
  );

  yield put(addTodolistAC(res.data.data.item));
  yield put(setAppStatusAC("succeeded"));
}
export const addTodolist = (title: string) => ({
  type: "TODOLISTS/ADD_TODOLIST",
  title,
});

function* changeTodolistTitleSaga({
  id,
  title,
}: ReturnType<typeof changeTodolistTitle>) {
  yield call(todolistsAPI.updateTodolist, id, title);

  yield put(changeTodolistTitleAC(id, title));
}
export const changeTodolistTitle = (id: string, title: string) => ({
  type: "TODOLISTS/CHANGE_TODOLIST_TITLE",
  id,
  title,
});

export function* todolistsSaga() {
  yield takeEvery("TODOLISTS/FETCH_TODOLISTS", fetchTodolistsSaga);
  yield takeEvery("TODOLISTS/REMOVE_TODOLIST", removeTodolistSaga);
  yield takeEvery("TODOLISTS/ADD_TODOLIST", addTodolistSaga);
  yield takeEvery("TODOLISTS/CHANGE_TODOLIST_TITLE", changeTodolistTitleSaga);
}
