import ImagePill from '/src/components/base/notifications/pills/image-pill/image-pill.vue'
import '/src/stories/utils.css';
import '/src/assets/styles/index.css';

export default { 
  title: "components/Image Pill",
  component: ImagePill,
  argTypes: {}
};


const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ImagePill },
  template: '<div class="p-2"><imagePill v-bind="$props" /></div>'
});

export const Default = Template.bind({});
Default.args = {
  label: 'mountains',
};