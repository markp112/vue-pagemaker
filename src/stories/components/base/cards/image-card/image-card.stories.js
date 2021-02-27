import ImageCard from '/src/components/base/cards/image-card/image-card.vue';
import '/src/stories/utils.css';
import '/src/assets/styles/index.css';

export default { 
  title: "components/cards/image card",
  component: ImageCard,
  argTypes: { 
    removeTag: { action: 'removeTag' },
    deleteImage: { action: 'deleteImage' },
    imageSelected: { action: 'imageSelected' },
  }
};

const imageCard = {
  title: 'Test Image',
  tags: ['test tag', 'blank-card', 'boring'],
  url: 'https://tse2.mm.bing.net/th/id/OIP.hC6-0Hq5P0w6P1ocIpMNAwHaD4?w=341&h=180&c=7&o=5&pid=1.7'
}

const imageCardPortrait = {
  title: 'Test Image',
  tags: ['test tag', 'blank-card', 'boring'],
  url: 'http://flowerinfo.org/wp-content/gallery/gerbera-flowers/gerbera-flower-9.jpg'
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { ImageCard },
  template: `<div class="p-2">
    <image-card 
      v-bind="$props"
      @removeTag="removeTag($event)"
      @deleteImage="deleteImage($event)" 
      @imageSelected="imageSelected($event)"
    />
    </div>`
});

export const Default = Template.bind({});
Default.args = {
  image: imageCard,
};

export const PortraitImage = Template.bind({});
PortraitImage.args = {
  image: imageCardPortrait,
};
