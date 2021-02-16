import Slider from '../../../../../components/base/sliders/slider/slider.vue';
import '../../../../utils.css';
export default { 
  title: "components/slider",
  component: Slider,
  argTypes: {}
};


const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Slider },
  template: '<div class="bg-siteLight p-2" ><slider v-bind="$props" @onchange="onChange" />'
});

export const Default = Template.bind({});
Default.args = {
  sliderValue: 127,
};

export const MaxValue = Template.bind({});
MaxValue.args = {
  sliderValue: 255,
};

export const MinValue = Template.bind({});
MinValue.args = {
  sliderValue: 0,
};

export const WithLabel = Template.bind({});
WithLabel.args = {
  sliderValue: 127,
  caption: 'Label',
}