import React, {useCallback, useEffect} from 'react'
import {AddItemForm, AddItemFormSubmitHelperType} from '../../../components/AddItemForm/AddItemForm'
import {EditableSpan} from '../../../components/EditableSpan/EditableSpan'
import {Button, IconButton, Paper, PropTypes} from '@material-ui/core'
import {Delete} from '@material-ui/icons'
import {Task} from './Task/Task'
import {FilterValuesType, TodolistDomainType} from '../todolists-reducer'
import {tasksActions, todolistsActions} from "../index";
import {TaskStatuses, TaskType} from "../../../api/types";
import {useActions, useAppDispatch} from "../../../utils/redux-utils";

type PropsType = {
    todolist: TodolistDomainType
    tasks: Array<TaskType>
    demo?: boolean
}

export const Todolist = React.memo(function ({demo = false, ...props}: PropsType) {

    const {fetchTasks} = useActions(tasksActions)
    const {removeTodolist, changeTodolistTitle, changeTodolistFilter} = useActions(todolistsActions)

    useEffect(() => {
        if (demo) {
            return
        }
        fetchTasks(props.todolist.id)
    }, [])

    const dispatch = useAppDispatch()


    const addTaskCallback = useCallback(async (title: string, helper: AddItemFormSubmitHelperType) => {
        debugger
        let thunk = tasksActions.addTask({title: title, todolistId: props.todolist.id})
        const resultAction = await dispatch(thunk)
        if (tasksActions.addTask.rejected.match(resultAction)) {
            if (resultAction.payload?.errors?.length) {
                const errorMessage = resultAction.payload?.errors[0]
                helper.setError(errorMessage)
            } else {
                helper.setError('Some error occured')
            }
        } else {
            helper.setTitle('')
        }

    }, [props.todolist.id])


    const changeTodolistTitleCallback = useCallback((title: string) => {
        changeTodolistTitle({id: props.todolist.id, title})
    }, [props.todolist.id, changeTodolistTitle])

    const onFilterButtonClickHandler = useCallback((filter: FilterValuesType) => {
        changeTodolistFilter({
            filter: filter,
            id: props.todolist.id
        })
        console.log(filter)
    }, [props.todolist.id])

    const filterButton = (todolistFilter: FilterValuesType, color: PropTypes.Color, text: string) => {
        return <Button variant={props.todolist.filter === todolistFilter ? 'outlined' : 'text'}
                       onClick={() => onFilterButtonClickHandler(todolistFilter)}
                       color={color}>{text}
        </Button>
    }
    let tasksForTodolist = props.tasks

    if (props.todolist.filter === 'active') {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (props.todolist.filter === 'completed') {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.Completed)
    }


    return <Paper style={{padding: '10px', position: 'relative'}}>
        <IconButton onClick={() => removeTodolist(props.todolist.id)}
                    disabled={props.todolist.entityStatus === 'loading'}
                    style={{position: 'absolute', right: '5px', top: '5px'}}
                    size={'small'}>
            <Delete fontSize={'small'}/>
        </IconButton>
        <h3 style={{wordWrap: 'break-word'}}>
            <EditableSpan value={props.todolist.title} onChange={changeTodolistTitleCallback}/>
        </h3>
        <AddItemForm addItem={addTaskCallback} disabled={props.todolist.entityStatus === 'loading'}/>
        <div>
            {
                tasksForTodolist.map(t => <Task key={t.id} task={t} todolistId={props.todolist.id}/>)
            }
            {!tasksForTodolist.length && <div style={{padding: '10px', color: 'grey'}}>No task</div>}
        </div>
        <div style={{paddingTop: '10px'}}>
            {filterButton('all', 'default', 'All')}
            {filterButton('active', 'primary', 'Active')}
            {filterButton('completed', 'secondary', 'Completed')}
        </div>
    </Paper>
})




