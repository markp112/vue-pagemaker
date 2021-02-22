import DropdownMultiSelect from '/src/components/base/pickers/dropdown-multi-select/dropdown-multi-select.vue';
import '/src/stories/utils.css';
import '/src/assets/styles/index.css';

export default { 
  title: "components/Multi Select",
  component: DropdownMultiSelect,
  argTypes: {}
};


const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { DropdownMultiSelect },
  template: '<div class="p-2"><dropdownMultiSelect v-bind="$props" /></div>'
});

export const Default = Template.bind({});