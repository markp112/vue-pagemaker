import  TextData  from '../../../../../../components/page-builder-elements/generic/paritals/text-component/text-data.vue';
import '../../../../../utils.css';
export default { 
  title: "components/textdata",
  component: TextData,
  argTypes: {}
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { TextData },
  template: '<text-data v-bind="$props" />'
});

export const Default = Template.bind({});
Default.args = {
  content: "this is some content"
};

export const SpanWithSyle = Template.bind({});
SpanWithSyle.args = {
  content: "<span style='color:red;'> Some red text </span> and text that is not red"
}

export const SpanWithClass = Template.bind({});
SpanWithClass.args = {
  content: "<span class='text-decoration underline'> this is underlined </span> and text that is not"
}
