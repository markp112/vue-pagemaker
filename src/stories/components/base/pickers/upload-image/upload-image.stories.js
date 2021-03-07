import  UploadImage from '/src/components/base/pickers/upload-image/upload-image.vue';
import '/src/assets/styles/index.css';

export default { 
  title: "components/pickers/upload-image",
  component: UploadImage,
  argTypes: {
    imageUrl: { action: 'image-url' },
  }
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { UploadImage },
  template: `
  <div class="w-2/12">
    <UploadImage v-bind="$props" @image-url="imageUrl" />
  </div>`
});

export const Default = Template.bind({});

export const WithImage = Template.bind({});
WithImage.args = {
  urlEdited: "https://static2.hotcarsimages.com/wordpress/wp-content/uploads/2020/02/Bugatti-Atlantic.jpg"
}

