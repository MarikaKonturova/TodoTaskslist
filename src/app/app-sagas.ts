import { AxiosResponse } from "axios";
import { call, put, takeEvery } from "redux-saga/effects";
import { UserMeType, authAPI, ResponseType } from "../api/todolists-api";
import { setIsLoggedInAC } from "../features/Login/auth-reducer";
import { setInitializedAC } from "./app-reducer";

export function* initializeAppSaga() {
  const res: AxiosResponse<ResponseType<UserMeType>> = yield call(authAPI.me);
  if (res.data.resultCode === 0) {
    yield put(setIsLoggedInAC(true));
  } else {
  }
  yield put(setInitializedAC(true));
}
export const initializeApp = () => ({ type: "APP/INITIALIZE-APP" });
export function* appSaga() {
  yield takeEvery("APP/INITIALIZE-APP", initializeAppSaga);
}
