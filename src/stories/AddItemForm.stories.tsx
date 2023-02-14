import { ComponentMeta, ComponentStory } from "@storybook/react";

import { AddItemForm } from "../components/AddItemForm/AddItemForm";

export default {
  title: "Todolist/AddItemForm",
  component: AddItemForm,
} as ComponentMeta<typeof AddItemForm>;

const Template: ComponentStory<typeof AddItemForm> = (args) => (
  <AddItemForm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
