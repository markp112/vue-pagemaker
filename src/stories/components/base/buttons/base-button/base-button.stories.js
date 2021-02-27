import BaseButton from '/src/components/base/buttons/base-button/base-button.vue';
import '/src/stories/utils.css';
import '/src/assets/styles/index.css';

export default { 
  title: "components/buttons/BaseButton",
  component: BaseButton,
  argTypes: { 
    onClick: { action: 'onClick' },
  }
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { BaseButton },
  template: `<div class="p-2">
    <base-button
      v-bind="$props"
      @onClick="onClick"
    />
    </div>`
});

export const Default = Template.bind({});
Default.args = {
  label: 'ok',
  size: 'medium',
};

export const Small = Template.bind({});
Small.args = {
  label: 'small',
  size: 'small',
};

export const ExtraSmall = Template.bind({});
ExtraSmall.args = {
  label: 'x-small',
  size: 'x-small',
};

export const Blue = Template.bind({});
Blue.args = {
  label: 'blue',
  size: 'medium',
  bgColour: 'bg-red-500'
};