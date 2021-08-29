import {combineReducers} from 'redux'
import thunkMiddleware from 'redux-thunk'
import {configureStore} from "@reduxjs/toolkit";
import {appReducer} from "../features/Application";
import {tasksReducer, todolistsReducer} from "../features/TodolistsList";
import {authReducer} from "../features/Auth";

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
export const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
})
// непосредственно создаём store
export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunkMiddleware)
})
//export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
// определить автоматически тип всего объекта состояния
//interface IRootState extends AppRootStateType{}
//лучше писать через селектор, чем чз mapStateToProps: мы можем применять функцию к возвращаемому значению (фильтр и проч.)
//export const selectAuthStore  = (state: IRootState) => state.auth
// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;
