<template>  
  <section>
    <p>Colours</p>
    <div class="sidebar-button-panel flex-wrap text-accent-600 h-16"> 
      <div class="flex flex-col justify-evenly flex-no-wrap w-8/12 h-10 p-1 mt-0 leading-none">
        <div class="flex flex-row justify-between">
          <label for="background"
            class="mt-1" 
            :class="{
              'text-secondary-600': textBackgroundorBorder === 'background', 
            }"
          >
            background
          </label>
          <input
            type="radio"
            name="bg-check"
            id="background"
            value="background"
           
            @click="onRadioChange('background')"
          />
        </div>
        <div class="flex flex-row justify-between">
          <label for="font"
          class="mt-1"
            :class="{
              'text-secondary-600': textBackgroundorBorder === 'color',
            }"
          >
            font
          </label>
          <input
            type="radio"
            name="bg-check"
            id="font"
            value="font"
            checked
            @click="onRadioChange('color')"
          />
        </div>
        <div class="flex flex-row justify-evenly">
          <label for="border"
          class="mt-1"
          :class="{
              'text-secondary-600': textBackgroundorBorder === 'border',
            }"
          >
            border
          </label>
          <input
            type="radio"
            name="bg-check"
            id="border"
            value="border"
            @click="onRadioChange('border')"
          />
        </div>
      </div>
      <div class="flex justify-evenly flex-col flex-no-wrap w-4/12">
       <colour-picker @onColourChange="onColourChange"></colour-picker>
      </div>
    </div>
  </section>        
</template>

<script lang="ts">
import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import ColourDropdown from '@/components/base/pickers/colour-picker/colour-dropdown.vue';
import { BackgroundBorderForeground, Colour } from '@/classes/colour/singleton-colour';
import { Emit } from 'vue-property-decorator';
import { StyleElement } from '../../../../classes/text-attributes/text-attributes';
import { SidebarButtonEventManager } from '@/classes/sidebarButtonEventManager/sidebarButtonEventManager';

@Component({
  components: {
    'colour-picker': ColourDropdown,
  },
})
export default  class ColourSelect extends Vue {
  textBackgroundorBorder: BackgroundBorderForeground = 'color';
  colour: Colour = Colour.getInstance();

  onRadioChange(bbf: BackgroundBorderForeground) {
    this.textBackgroundorBorder = bbf;
    this.colour.backgroundBorderForeground = bbf;
  }

  @Emit("onColourChange")
  onColourChange() {
    const style: StyleElement = {
      styleName: this.textBackgroundorBorder,
      value: this.colour.rgbColour,
      units: 'px',
    }
    const eventManager = SidebarButtonEventManager.getInstance();
    eventManager.applyValue('colour', style);
    return;
  }
}
</script>