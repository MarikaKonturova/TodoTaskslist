import {Dispatch} from 'redux'
import {setAppStatusAC} from "../../app/app-reducer";
import {authAPI, UserLoginType} from "../../api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = {
    isLoggedIn: false
}
const slice = createSlice({
    name: 'auth',
    initialState,
    reducers:{
        setIsLoggedInAC(state, action: PayloadAction<{value: boolean}>){
            state.isLoggedIn = action.payload.value
        }
    }
})
export const authReducer = slice.reducer
export const {setIsLoggedInAC} = slice.actions
// thunks
export const loginTC = (data: UserLoginType) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    authAPI.login(data).then(res => {
        if (res.data.resultCode === 0) {
            const action = dispatch(setIsLoggedInAC({value: true}))
            dispatch(action)
            dispatch(setAppStatusAC({status: 'succeeded'}))
        } else {
            handleServerAppError(res.data, dispatch);
        }
    })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}


