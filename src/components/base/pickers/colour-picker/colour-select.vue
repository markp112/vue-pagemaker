<template>  
  <section>
    <p class="mb-3">Colours</p>
    <div class="sidebar-button-panel"> 
      <div class="flex flex-col justify-evenly flex-no-wrap w-8/12 h-10 p-1 mt-0 leading-none">
        <div class="sidebar-radio-container">
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
        <div class="sidebar-radio-container">
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
        <div class="sidebar-radio-container">
          <label for="border"
          class="mt-1"
          :class="{
              'text-secondary-600': textBackgroundorBorder === 'border-color',
            }"
          >
            border
          </label>
          <input
            type="radio"
            name="bg-check"
            id="border"
            value="border-color"
            @click="onRadioChange('border-color')"
          />
        </div>
      </div>
      <div class=" w-4/12">
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
    eventManager.updateEditedComponent();
    return;
  }
}
</script>