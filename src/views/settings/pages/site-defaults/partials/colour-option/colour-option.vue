<template>
  <div class="flex flex-row justify-between w-9/12 mt-1">
    <p
      class="ml-6 w-6/12 cursor-pointer"
      @click="selectOption()"  
    >{{ $props.heading }}</p>
    <colour-dropdown
      :colourProp="$props.colour"
      @onColourChange="onChange($event)"
    ></colour-dropdown>
    <span class="border border-gray-500 inline-block ml-1 w-2/12 text-sm h-6">
      {{ $props.colour }}
    </span>
  </div>
</template>

<script lang="ts">
import { Style } from '@/models/styles/styles';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit } from 'vue-property-decorator';
import ColourDropdown from '@/components/base/pickers/colour-picker/colour-dropdown.vue'; 

@Component({
  props: {
    heading: {
      default: '',
    },
    colour: {
      default: '',
    }
  },
  components: {
    'colour-dropdown': ColourDropdown,
  }
})
export default class ColourOption extends Vue {
  selected = false;
 
  @Emit('onChange')
  onChange(colour: string): string {
    colour = this.convertToHex(colour);
    return colour;
  }

 private componentToHex(rgb: number) {
  const hex = rgb.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
  }

  private rgbToHex(r: number, g: number, b: number) {
  return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
  }

  private convertToHex(rgbColour: string): string {
    if (rgbColour.substring(0) === '#') return rgbColour;
    const rgb = rgbColour.split("(")[1].split(")")[0];
    const rgbArray = rgb.split(",");
    return this.rgbToHex(
        parseInt(rgbArray[0]),
        parseInt(rgbArray[1]),
        parseInt(rgbArray[2])
        )
  }

  selectOption() {
    this.selected = true;
  }
}
</script>