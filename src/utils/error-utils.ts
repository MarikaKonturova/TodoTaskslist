import {appActions} from "../features/CommonActions/App";
import {ResponseType} from '../api/types'
import {AxiosError} from "axios";

type ThunkAPIType = {
    dispatch: (action: any) => any
    rejectWithValue: Function
}
const {setAppStatus, setAppError} = appActions

export const handleServerAppError = <D>(data: ResponseType<D>,
                                        thunkAPI: ThunkAPIType,
                                        showError = true
) => {
    if (data.messages.length) {
        thunkAPI.dispatch(setAppError({error: data.messages[0]}))

    } else {
        thunkAPI.dispatch(setAppError({error: 'Some error occurred'}))
    }
    thunkAPI.dispatch(setAppStatus({status: 'failed'}))
    return thunkAPI.rejectWithValue({errors: data.messages, fieldsErrors: data.fieldsErrors})
}

export const handleServerNetworkError = (error: AxiosError,
                                         thunkAPI: ThunkAPIType,
                                         showError = true) => {
    thunkAPI.dispatch(setAppError({error: error.message ? error.message : 'Some error occurred'}))
    thunkAPI.dispatch(setAppStatus({status: 'failed'}))
    return thunkAPI.rejectWithValue({errors: [error.message], fieldsErrors: undefined})

}
