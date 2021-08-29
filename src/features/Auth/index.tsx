import * as authSelectors from './selectors'
import {asyncActions, slice} from "./auth-reducer";
import {Login} from './Login'

const authActions = {
    ...asyncActions,
    ...slice.actions
}

const authReducer = slice.reducer

export {
    Login,
    authSelectors,
    authReducer,
    authActions
}
