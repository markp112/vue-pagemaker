import Confirm from '/src/components/base/popups/confirm/confirm.vue';
import '/src/stories/utils.css';
import '/src/assets/styles/index.css';

export default { 
  title: "components/popups/confirm-dialog",
  component: Confirm,
  argTypes: { 
    onYesClick: { action: 'onYesClick' },
    onNoClick: { action: 'onNoClick' },
  }
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Confirm },
  template: `<div class="p-2">
    <confirm
      v-bind="$props"
      @yesClicked="onYesClick"
      @noClicked="onNoClick"
    />
    </div>`
});

export const Default = Template.bind({});
Default.args = {
  message: 'confirm delete'
};
