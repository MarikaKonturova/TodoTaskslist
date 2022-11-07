import { call, put } from "redux-saga/effects";
import { authAPI } from "../api/todolists-api";
import { setIsLoggedInAC } from "../features/Login/auth-reducer";
import { setInitializedAC } from "./app-reducer";
import { initializeAppSaga } from "./app-sagas";
let meResponse;
beforeEach(() => {
  meResponse = {
    data: { resultCode: 0 },
  };
});
test("initializeAppSaga login success", () => {
  const gen = initializeAppSaga();
  let result = gen.next();
  expect(result.value).toEqual(call(authAPI.me));

  result = gen.next(meResponse);
  expect(result.value).toEqual(put(setIsLoggedInAC(true)));

  result = gen.next();
  expect(result.value).toEqual(put(setInitializedAC(true)));
});
test("initializeAppSaga login falied", () => {
  const gen = initializeAppSaga();
  let result = gen.next();
  expect(result.value).toEqual(call(authAPI.me));
  meResponse = {
    data: { resultCode: 1 },
  };
  result = gen.next(meResponse);
  expect(result.value).toEqual(put(setInitializedAC(true)));
});
