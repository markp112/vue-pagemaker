<template>  
  <section>
    <div class="sidebar-button-panel colour-select"> 
      <div class="colour-select-radios" v-if="$props.showLabels">
        <div class="sidebar-radio-container">
          <label for="background"
            class="mt-1" 
            :class="{
              'text-secondary-300': textBackgroundorBorder === 'background', 
            }"
          >
            background
          </label>
          <input
            type="radio"
            name="bg-check"
            id="background"
            value="background"
            @click="onRadioChange('backgroundColor')"
          />
        </div>
        <div class="sidebar-radio-container">
          <label for="font"
          class="mt-1"
            :class="{
              'text-secondary-300': textBackgroundorBorder === 'color',
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
              'text-secondary-300': textBackgroundorBorder === 'border-color',
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
      <div class="" :class="getContainerClass()">
        <colour-dropdown
          tooltip="From Palette"

          @onColourChange="onColourChange"
        >
          <template
            v-if="show"
            slot-scope="{ show }"
          >
            <colour-palette 
              class="absolute"
              @colour="onColourPickerChange($event)"
            >
            </colour-palette>
          </template>
        </colour-dropdown>
        <colour-dropdown 
          @onColourChange="onColourChange"
          :class="getElementClass"
          tooltip="Colour picker"
        >
          <template
            v-if="show"
            slot-scope="{ show }"
          >
            <colour-picker
              class="absolute"
              @colour="onColourPickerChange($event)"
            >
            </colour-picker>
          </template>
        </colour-dropdown>
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
import ColourPicker from './colour-picker.vue';
import ColourPaletteSidebar from '@/components/base/pickers/colour-picker/colour-palette-sidebar/colour-palette-sidebar.vue';

export type FlexAlignment = 'vertical' | 'horizontal';

@Component({
  components: {
    'colour-dropdown': ColourDropdown,
    'colour-palette': ColourPaletteSidebar,
    'colour-picker': ColourPicker,
  },
  props: {
    showLabels: { default: (): boolean => { return false; }},
    flexAlignment: { default: (): FlexAlignment => {
          return 'vertical';
      } 
    },
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
    return this.colour.rgbColour;
  }

  onColourPickerChange(colour: string) {
    this.colour.rgbColour = colour;
    this.onColourChange();
  }

  getContainerClass() {
    if (this.$props.flexAlignment === 'vertical') {
      return 'flex flex-col justify-start w-3/12';
    } else {
      return 'flex flex-row justify-evenly w-4/12 ml-4';
    }
  }

  getElementClass() {
     if (this.$props.flexAlignment === 'vertical') {
      return 'mt-2';
    } else {
      return 'ml-2';
    }
  }
}
</script>

<style lang="postcss" scoped>
  .colour-select {
    
  }

  .colour-select-radios {
    @apply flex;
    @apply flex-col;
    @apply justify-start;
    @apply flex-no-wrap;
    @apply w-9/12;
    @apply p-1;
    @apply mt-0;
    @apply leading-none;
  }

  @screen md {
     .colour-select {
      @apply flex-col;
      @apply justify-start;
     }

     .colour-select-radios {
       @apply w-full;
     }
  @screen lg {
    .colour-select {
      @apply flex-row;
      @apply justify-start;
     }

     .colour-select-radios {
       @apply w-9/12;
     }
  }
  }
</style>