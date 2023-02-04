import { TodolistType } from "../api/types";
import { tasksReducer, todolistsReducer } from "../features/TodolistsList";
import { TasksStateType } from "../features/TodolistsList/tasks-reducer";
import { addTodolist, TodolistDomainType } from "../features/TodolistsList/todolists-reducer";

test('ids should be equals', () => {
    const startTasksState: TasksStateType = {};
    const startTodolistsState: Array<TodolistDomainType> = [];
    let todolist: TodolistType = {
        title: 'new todolist',
        id: 'any id',
        addedDate: '',
        order: 0
    }
    const action = addTodolist.fulfilled({todolist}, 'requestId', todolist.title);

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodolists = endTodolistsState[0].id;

    expect(idFromTasks).toBe(action.payload.todolist.id);
    expect(idFromTodolists).toBe(action.payload.todolist.id);
});
