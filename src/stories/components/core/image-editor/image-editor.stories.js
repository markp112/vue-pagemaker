import  ImageEditorSidebar from '/src/components/core/sidebar/image-editor/image-editor.vue';
import '/src/assets/styles/index.css';

export default { 
  title: "components/ImageEditorSidebar",
  component: ImageEditorSidebar,
  argTypes: {
    
  }
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ImageEditorSidebar },
  template: '<ImageEditorSidebar v-bind="$props"/>'
});

export const Default = Template.bind({});

