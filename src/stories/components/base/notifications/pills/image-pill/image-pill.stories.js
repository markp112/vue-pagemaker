import ImagePill from '/src/components/base/notifications/pills/image-pill/image-pill.vue'
import '/src/stories/utils.css';
import '/src/assets/styles/index.css';

export default { 
  title: "components/Image Pill",
  component: ImagePill,
  argTypes: { removeTag: { action: 'removeTag' }}
};


const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ImagePill },
  template: '<div class="p-2"><imagePill v-bind="$props" @removeTag="removeTag($event)"/></div>'
});

export const Default = Template.bind({});
Default.args = {
  label: 'mountains',
  size: 'medium',
};

export const Large = Template.bind({});
Large.args = {
  label: 'mountains',
  size: 'large',
};

export const Small = Template.bind({});
Small.args = {
  label: 'mountains',
  size: 'small',
};

export const Blue = Template.bind({});
Blue.args = {
  label: 'mountains',
  pillColour: 'bg-blue-500',
  size: 'medium',
};