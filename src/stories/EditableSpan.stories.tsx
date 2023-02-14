import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { EditableSpan } from "../components/EditableSpan/EditableSpan";

export default {
  title: "Todolist/EditableSpan",
  component: EditableSpan,
  argTypes: {
    onCLick: {
      description: "Button inside form clicked",
    },
  },
} as ComponentMeta<typeof EditableSpan>;

const Template: ComponentStory<typeof EditableSpan> = (args) => (
  <EditableSpan {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  value: "Change me",
  onChange: action("EditableSpan value changed"),
};
