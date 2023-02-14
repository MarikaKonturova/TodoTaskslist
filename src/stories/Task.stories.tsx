/* import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Task } from "../features/TodolistsList/Todolist/Task/Task";

export default {
  title: "Todolist/Task",
  component: Task,
} as ComponentMeta<typeof Task>;

const changeTaskStatusCallback = action("Status changed inside task");
const changeTaskTitleCallback = action("Title changed inside task");
const removeTaskCallback = action("Remove button inside Task was clicked");

const baseArgs = {
  changeTaskStataus: changeTaskStatusCallback,
  changeTaskTitle: changeTaskTitleCallback,
  removeTask: removeTaskCallback,
};
const Template: ComponentStory<typeof Task> = (args) => <Task {...args} />;

export const TaskIsDoneExample = Template.bind({});
TaskIsDoneExample.args = {
  ...baseArgs,
  task: { id: "1", title: "JS" },
  todolistId: "todolistId1",
};
 */
export {};
