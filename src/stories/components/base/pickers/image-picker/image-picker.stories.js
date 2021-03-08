import ImagePicker from '/src/components/base/pickers/image-picker/image-picker.vue';

import '/src/stories/utils.css';
import '/src/assets/styles/index.css';

export default { 
  title: "components/pickers/image picker",
  component: ImagePicker,
  argTypes: { 
    closeClicked: { action: 'closeClicked' },
    imageClicked: { action: 'imageClicked' },
  }
};

const sampleImage = [
  {
    title:'test',
    tags: [],
    url: 'https://www.carscoops.com/wp-content/uploads/2020/01/Maserati-Millemiglia-.jpg',
  },
  {
    title:'test',
    tags: [],
    url: 'https://decepticomics.com/wp-content/uploads/2019/11/99-The-Best-Mclaren-Hypercar-2019-Style.jpg',
  },
  {
    title:'test',
    tags: [],
    url: 'https://pixfeeds.com/images/flowers/lotuses/1280-149133082-pink-bloomed-lotus-flower-with-stem.jpg',
  },
  {
    title:'test',
    tags: [],
    url: 'https://hips.hearstapps.com/countryliving.cdnds.net/17/01/1600x800/landscape-1483531892-scotland-mountains.jpg?',
  }
];

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ImagePicker },
  template: `<div class="p-2">
    <image-picker 
      v-bind="$props"
      @closeClicked="closeClicked()"
      @imageClicked="imageClicked($event)"
    />
    </div>`
});

export const Default = Template.bind({});
Default.args = {
  parentImages: sampleImage,
};
