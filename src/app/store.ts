import { tasksReducer } from "../features/TodolistsList/tasks-reducer";
import { todolistsReducer } from "../features/TodolistsList/todolists-reducer";
import { applyMiddleware, combineReducers, createStore } from "redux";
import thunkMiddleware from "redux-thunk";
import { appReducer } from "./app-reducer";
import { authReducer } from "../features/Login/auth-reducer";
import createSagaMiddleware from "redux-saga";
import { tasksSaga } from "../features/TodolistsList/tasks-sagas";
import { appSaga } from "./app-sagas";
import { all } from "redux-saga/effects";
import { todolistsSaga } from "../features/TodolistsList/todolist-sagas";

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
  app: appReducer,
  auth: authReducer,
});
const sagaMiddleware = createSagaMiddleware();
export const store = createStore(
  rootReducer,
  applyMiddleware(thunkMiddleware, sagaMiddleware)
);

function* mySaga() {
  //takeEvery не блокирует, иначе all
  yield all([appSaga(), tasksSaga(), todolistsSaga()]);
}
sagaMiddleware.run(mySaga);
export type AppRootStateType = ReturnType<typeof rootReducer>;
// @ts-ignore
window.store = store;
