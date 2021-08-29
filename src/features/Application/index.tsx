import * as appSelectors from './selectors'
import {asyncActions, slice} from "./application-reducer";
import {RequestStatusType as T1} from "./application-reducer";

const appReducer = slice.reducer

const appActions = {
    ...slice.actions,
    ...asyncActions
}
export type RequestStatusType = T1

export {
    appSelectors,
    appReducer,
    appActions
}
