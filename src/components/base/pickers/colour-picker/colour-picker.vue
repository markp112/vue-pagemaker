<template>
  <div>
    <div class="color-wrapper">
      <colour-palette :hue="hue" @colour="setColour"></colour-palette>
      <colour-slider  @colour="setHue" style="margin-left:16px"></colour-slider>
    </div>
    <div class="input-wrapper">
      <span class="text">{{ colour }}</span>
      <div
        class="color-div"
        :style="{'background-color': colour || 'white'}"
      ></div>
      <p class="text-style" @click="handleOkClick()">Ok</p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit } from 'vue-property-decorator';
import ColourPalette from './colour-palette.vue';
import ColourSlider from './colour-slider.vue';

@Component({
  components: {
    'colour-slider': ColourSlider,
    'colour-palette': ColourPalette,
  },
})
export default class ColourPicker extends Vue {
  name = 'colour-picker';
  public hue = '#000000';
  public colour = '#ffeedd';

@Emit('colour')
handleOkClick(){
  // event.stopPropagation();
  return this.colour;
}

setColour(rgbColour: string) {
  this.colour = rgbColour;
}

setHue(hue: string) {
  this.hue = hue;
}

}
</script>

<style lang="postcss" >
:host {
  display: block;
  width: auto;
  padding: 16px;
}
.color-wrapper {
  display: flex;
  height: 250px;
}

.input-wrapper {
  margin-top: 16px;
  display: flex;
  border-radius: 1px;
  border: 1px solid rgb(220, 220, 220);
  padding: 2px;
  height: 32px;
  justify-content: center;
}

.color-div {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid rgb(220, 220, 220);
  background-color: #ff4433;
}

.text {
  flex: 1;
  font-size: 14px;   
  font-family: Montserrat;
  line-height: 24px;
  
}

.text-style {
  font-size: 12px !important;
  font-family: inherit;
  display: inline-block;
  background-color: rgb(189, 173, 173);
  border: 1px solid rgb(220, 220, 220);
  color: rgb(224, 213, 213);
  text-align: center;
  width: 60px;
  padding: 2px 2px;
  margin-left: 20px;
  -webkit-box-shadow: inset 10px 15px 39px -6px rgba(115, 104, 216, 0.58);
  -moz-box-shadow: inset 10px 15px 39px -6px rgba(59, 14, 143, 0.58);
  box-shadow: inset 10px 15px 39px -6px rgba(25, 11, 151, 0.58);
  cursor: pointer;
  &:hover {
      background-color: rgb(189, 173, 173);
  }

}

</style>