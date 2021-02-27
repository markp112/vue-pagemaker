import Tag from '/src/components/base/popups/tag/tag.vue';
import '/src/stories/utils.css';
import '/src/assets/styles/index.css';

export default { 
  title: "components/popups/tag",
  component: Tag,
  argTypes: { 
  
  }
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Tag },
  template: `<div class="p-2">
    <tag
      class="w-54 h-16"
      v-bind="$props"
    />
    </div>`
});

export const Default = Template.bind({});
Default.args = {
};
