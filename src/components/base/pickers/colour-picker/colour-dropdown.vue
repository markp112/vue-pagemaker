<template>
  <div>
    <div class="flex flex-row flex-start relative">
    <img :src="getPath('color-32.png')" />
    <img
        :src="getPath('down-24.png')" 
        class="w-4 h-4 cursor-pointer hover:bg-gray-800"
        @click="show=!show"
          />
    </div>
    <colour-picker 
      v-if="show"
      @colour="onColourChange"
      class="absolute"
    >
    </colour-picker>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit } from 'vue-property-decorator';
import ColourPicker from './colour-picker.vue';

@Component({
  components: {
    'colour-picker': ColourPicker,
  },
})
export default class ColourDropdown extends Vue {
  name='colour-dropdown'
  private show = false

  @Emit("onColourChange")
  onColourChange(rgbColour: string): string {
    console.log("called")
    return rgbColour;
  }

  getPath(image: string): string {
    const path = require.context('@/assets/icons',false,/\.png$/);
    return path(`./${image}`);
  }
  
}
</script>