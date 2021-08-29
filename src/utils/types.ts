import {rootReducer, store} from "../app/store";
import {FieldErrorType} from "../api/types";

//redux common types

export type AppRootStateType = ReturnType<typeof rootReducer>
export type AppDispatchType = typeof store.dispatch
export type ThunkError = { rejectValue: { errors: Array<string>, fieldsErrors?: Array<FieldErrorType> } }
