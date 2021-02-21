import ImagePill from '../../../../../../components/base/notifications/pills/image-pill/image-pill.vue'
import '../../../../../../../.storybook/utils.css';

export default { 
  title: "components/Image Pill",
  component: ImagePill,
  argTypes: {}
};


const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ImagePill },
  template: '<div class="bg-siteLight p-2" ><imagePill v-bind="$props" /></div>'
});

export const Default = Template.bind({});