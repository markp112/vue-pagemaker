import ImageLibrary from '/src/views/image-library/image-library.vue'
import '/src/stories/utils.css';
import '/src/assets/styles/index.css';

export default { 
  title: "views/Image Library",
  component: ImageLibrary,
  argTypes: { 
    onClick: { action: 'onClick' },
  }
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ImageLibrary },
  template: `
    <div class="p-2 w-full">
      <image-library></image-library>
    </div>`
});

export const Default = Template.bind({});
Default.args = {
 
};