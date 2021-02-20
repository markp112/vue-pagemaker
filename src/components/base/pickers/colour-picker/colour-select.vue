<template>
  <section>
    <div class="sidebar-button-panel colour-select">
      <div class="colour-select-radios" v-if="$props.showLabels">
        <div class="sidebar-radio-container">
          <label
            for="background"
            class="mt-1"
            :class="{
              'text-secondary-300': textBackgroundorBorder === 'background'
            }"
          >
            background
          </label>
          <input
            type="radio"
            name="bg-check"
            id="background"
            value="background"
            @click="onRadioChange('background-color')"
          />
        </div>
        <div class="sidebar-radio-container">
          <label
            for="font"
            class="mt-1"
            :class="{
              'text-secondary-300': textBackgroundorBorder === 'color'
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
          <label
            for="border"
            class="mt-1"
            :class="{
              'text-secondary-300': textBackgroundorBorder === 'border-color'
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
        <div class="w-100 h-16">
          <slider-control 
            sliderValue="255"
            caption="transparency"
            @onSliderChange="onSliderChange($event)"
            ></slider-control>
        </div>
      </div>
      <colour-dropdown
        tooltip="From Palette"
        @onColourChange="onColourChange($event)"
      >
      </colour-dropdown>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import ColourDropdown from "@/components/base/pickers/colour-picker/colour-dropdown.vue";
import {
  BackgroundBorderForeground,
  Colour
} from "@/classes/colour/singleton-colour";
import Slider from '@/components/base/sliders/slider/slider.vue'; 
import { Emit } from "vue-property-decorator";
import { StyleElement } from "../../../../classes/text-attributes/text-attributes";
import { SidebarButtonEventManager } from "@/classes/sidebarButtonEventManager/sidebarButtonEventManager";
import ColourPaletteSidebar from "@/components/base/pickers/colour-picker/colour-palette-sidebar/colour-palette-sidebar.vue";
export type FlexAlignment = "vertical" | "horizontal";

@Component({
  components: {
    "colour-dropdown": ColourDropdown,
    "colour-palette-sidebar": ColourPaletteSidebar,
    "slider-control": Slider,
  },
  props: {
    showLabels: {
      default: (): boolean => {
        return false;
      }
    },
    flexAlignment: {
      default: (): FlexAlignment => {
        return "vertical";
      }
    }
  }
})
export default class ColourSelect extends Vue {
  textBackgroundorBorder: BackgroundBorderForeground = "color";
  colour: Colour = Colour.getInstance();

  onRadioChange(bbf: BackgroundBorderForeground) {
    this.textBackgroundorBorder = bbf;
    this.colour.backgroundBorderForeground = bbf;
  }

  @Emit("onColourChange")
  onColourChange(colour: string) {
    const style: StyleElement = {
      styleName: this.textBackgroundorBorder,
      value: colour,
      units: 'px'
    };
    const eventManager = SidebarButtonEventManager.getInstance();
    eventManager.applyValue("colour", style);
    eventManager.updateEditedComponent();
    return colour;
  }

  @Emit("onSliderChange")
  onSliderChange(value: number) {
    const style: StyleElement = {
      styleName: 'transparency',
      value: value.toString(),
      units: ''
    };
    const eventManager = SidebarButtonEventManager.getInstance();
    eventManager.applyValue("colour", style);
    eventManager.updateEditedComponent();
    return value;
  }

  getContainerClass() {
    if (this.$props.flexAlignment === "vertical") {
      return "flex flex-col justify-start w-3/12";
    } else {
      return "flex flex-row justify-evenly w-4/12 ml-4";
    }
  }

  getElementClass() {
    if (this.$props.flexAlignment === "vertical") {
      return "mt-2";
    } else {
      return "ml-2";
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
  @apply flex-nowrap;
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
</style>
