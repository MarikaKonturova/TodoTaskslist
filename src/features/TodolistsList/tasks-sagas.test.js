import { call, put } from "redux-saga/effects";
import { fetchTasksSaga, removeTaskSaga } from "./tasks-sagas";
import {
  TaskPriorities,
  TaskStatuses,
  todolistsAPI,
} from "./../../api/todolists-api";
import { setAppStatusAC } from "./../../app/app-reducer";
import { setTasksAC, removeTaskAC } from "./tasks-reducer";
import { Todolist } from "./Todolist/Todolist";
let todolistId, taskId;
beforeEach(() => {
  todolistId = "randomId";
  taskId = "1";
});
test("fetchTasksSaga success", () => {
  const gen = fetchTasksSaga({ type: "", todolistId: todolistId });
  expect(gen.next().value).toEqual(put(setAppStatusAC("loading")));
  expect(gen.next().value).toEqual(call(todolistsAPI.getTasks, todolistId));
  const fakeApiResponse = {
    error: "",
    totalCount: 1,
    items: [
      {
        id: "1",
        title: "CSS",
        status: TaskStatuses.New,
        todoListId: todolistId,
        description: "",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low,
      },
    ],
  };
  expect(gen.next(fakeApiResponse).value).toEqual(
    put(setTasksAC(fakeApiResponse.items, todolistId))
  );
  expect(gen.next().value).toEqual(put(setAppStatusAC("succeeded")));
});

