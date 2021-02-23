import DropdownMultiSelect from '/src/components/base/pickers/dropdown-multi-select/dropdown-multi-select.vue';
import '/src/stories/utils.css';
import '/src/assets/styles/index.css';

export default { 
  title: "components/Multi Select",
  component: DropdownMultiSelect,
  argTypes: {
    listItems: { control: { type: 'array' }}
  }
};

const listItems = [
  'montains',
  'people',
  'flowers',
  'seascapes',
  'landscapes',
  'cars',
  'cats',
  'dogs',
]

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { DropdownMultiSelect },
  template: '<div class="p-2 w-6/12"><dropdownMultiSelect @itemClick="itemClick" v-bind="$props" /></div>'
});

export const Default = Template.bind({});
Default.args = {
  listItems: listItems,
}
