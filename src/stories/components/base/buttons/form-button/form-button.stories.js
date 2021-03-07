import FormButton from '/src/components/base/buttons/form-button.vue';
import '/src/stories/utils.css';
import '/src/assets/styles/index.css';

export default { 
  title: "components/buttons/FormButton",
  component: FormButton,
  argTypes: { 
    onClick: { action: 'onClick' },
  }
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { FormButton },
  template: `<div class="p-2">
    <form-button
      v-bind="$props"
    />
    </div>`
});

export const Default = Template.bind({});
Default.args = {
  label: 'ok'
};
