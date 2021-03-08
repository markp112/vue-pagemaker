import Tag from '/src/components/base/popups/tag/tag.vue';
import '/src/stories/utils.css';
import '/src/assets/styles/index.css';

export default { 
  title: "components/popups/tag",
  component: Tag,
  argTypes: { 
    onOkClick: { action: 'onOkClick' },
    onCloseClick: { action: 'onCloseClick' },
  }
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Tag },
  template: `<div class="p-2">
    <tag
      class="w-54 h-20"
      v-bind="$props"
      @onOkClick="onOkClick"
      @onCloseClick="onCloseClick"
    />
    </div>`
});

export const Default = Template.bind({});
Default.args = {
};
