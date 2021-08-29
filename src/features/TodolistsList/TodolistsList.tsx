import React, {useCallback, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {TodolistDomainType} from './todolists-reducer'
import {TasksStateType} from './tasks-reducer'
import {Grid, Paper} from '@material-ui/core'
import {AddItemForm, AddItemFormSubmitHelperType} from '../../components/AddItemForm/AddItemForm'
import {Todolist} from './Todolist/Todolist'
import {Redirect} from "react-router-dom";
import {AppRootStateType} from "../../utils/types";
import {useActions, useAppDispatch} from "../../utils/redux-utils";
import {todolistsActions} from "./index";

type PropsType = {
    demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = ({demo = false}) => {
    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)
    const {fetchTodolists} = useActions(todolistsActions)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (demo || !isLoggedIn) {
            return;
        }
        fetchTodolists()
    }, [])


    const addTodolistCallback = useCallback(async (title: string, helper: AddItemFormSubmitHelperType) => {
        const thunk = todolistsActions.addTodolist(title)
        const resultAction = await dispatch(thunk)
        if (todolistsActions.addTodolist.rejected.match(resultAction)) {
            if (resultAction.payload?.errors?.length) {
                const errorMessage = resultAction.payload?.errors[0]
                helper.setError(errorMessage)
            } else {
                helper.setError('Some error occurred')
            }
        } else {
            helper.setTitle('')
        }
    }, [dispatch])

    if (!isLoggedIn) {
        return <Redirect to={'/login'}/>
    }
    return <>
        <Grid container style={{padding: '20px'}}>
            <AddItemForm addItem={addTodolistCallback}/>
        </Grid>
        <Grid container spacing={3} style={{flexWrap: 'nowrap', overflowX: 'scroll'}}>
            {
                todolists.map(tl => {
                    let allTodolistTasks = tasks[tl.id]

                    return <Grid item key={tl.id}>
                        <div style={{flexWrap: 'wrap', width: '300px'}}>
                            <Todolist
                                todolist={tl}
                                tasks={allTodolistTasks}
                                demo={demo}
                            />
                        </div>
                    </Grid>
                })
            }
        </Grid>
    </>
}
