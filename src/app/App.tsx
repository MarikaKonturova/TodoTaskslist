import React, {useCallback, useEffect} from 'react'
import './App.css'
import {
    AppBar,
    Button,
    CircularProgress,
    Container,
    IconButton,
    LinearProgress,
    Toolbar,
    Typography
} from '@material-ui/core'
import {Menu} from '@material-ui/icons'
import {TodolistsList} from '../features/TodolistsList'
import {ErrorSnackbar} from '../components/ErrorSnackbar/ErrorSnackbar'
import {useSelector} from 'react-redux'
import {authActions, Login} from "../features/Auth";
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom'
import {appActions} from "../features/Application";
import {selectIsInitialized, selectStatus} from "../features/Application/selectors";
import {selectIsLoggedIn} from "../features/Auth/selectors";
import {useActions, useAppDispatch} from "../utils/redux-utils";

type PropsType = {
    demo?: boolean
}

function App({demo = false}: PropsType) {
    const status = useSelector(selectStatus)
    const isInitialized = useSelector(selectIsInitialized)
    const isLoggedIn = useSelector(selectIsLoggedIn)

    const {logout} = useActions(authActions)
    const {initializeApp} = useActions(appActions)


    useEffect(() => {
        initializeApp()
    }, [])
    const LogoutHandler = useCallback(() => {
        logout()
    }, [])


    if (!isInitialized) {
        return <div style={{position: 'fixed', width: '100%', top: '30%', left: '50%'}}>
            <CircularProgress/>
        </div>
    }


    return (
        <BrowserRouter>
            <div className="App">
                <ErrorSnackbar/>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton edge="start" color="inherit" aria-label="menu">
                            <Menu/>
                        </IconButton>
                        <Typography variant="h6">
                            News
                        </Typography>
                        {isLoggedIn ? <Button color="inherit" onClick={LogoutHandler}>Log out</Button> : null}
                    </Toolbar>
                    {status === 'loading' && <LinearProgress/>}
                </AppBar>
                <Container fixed>

                    <Switch>
                        <Route exact path={'/'} render={() => <TodolistsList demo={demo}/>}/>
                        <Route path={'/login'} render={() => <Login/>}/>
                        <Route path={'/404'} render={() => <h1>404: PAGE NOT FOUND</h1>}/>
                        <Redirect from={'*'} to={'/404'}/>
                    </Switch>
                </Container>
            </div>
        </BrowserRouter>
    )
}

export default App
