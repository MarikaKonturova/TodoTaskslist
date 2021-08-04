import {Dispatch} from "redux";
import {setIsLoggedInAC} from "../features/Login/auth-reducer";
import {authAPI} from "../api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as string | null,
    isInitialized: false
}
const slice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setAppErrorAC(state, action: PayloadAction<{ error: string | null }>) {
            state.error = action.payload.error
        },
        setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status
        },
        setInitializedAC(state, action: PayloadAction<{ isInitialized: boolean }>) {
            state.isInitialized = action.payload.isInitialized
        }
    }
})
export const appReducer = slice.reducer
export const {setAppErrorAC, setAppStatusAC, setInitializedAC} = slice.actions

export const intializeAppTC = () => (dispatch: Dispatch) => {
    authAPI.me().then(res => {
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC({value: true}))
        } else {
        }
        dispatch(setInitializedAC({isInitialized: true}))
    })
}

export const LogoutTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    authAPI.delete().then(res => {
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC({value: false}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        } else {
            handleServerAppError(res.data, dispatch);
        }
    })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })

}

//types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

