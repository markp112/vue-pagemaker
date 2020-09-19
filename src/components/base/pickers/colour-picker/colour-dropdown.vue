<template>
  <div>
    <div class="flex flex-row flex-start relative">
    <div 
      class="w-8 h-8 border border-gray-200"
      v-bind:style="{ backgroundColor: colour() }"
      @click="emitColour()"
    >
    </div>
    <img
        :src="getPath('down-24.png')" 
        class="w-4 h-4 cursor-pointer hover:bg-gray-800"
        @click="show=!show"
          />
    </div>
    <colour-picker 
      v-if="show"
      @colour="emitColour()"
      @mouseLeave="show=!show"
      @mouseout="show=!show"
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
import { Colour } from '@/classes/colour/singleton-colour';

@Component({
  components: {
    'colour-picker': ColourPicker,
  },
})
export default class ColourDropdown extends Vue {
  name='colour-dropdown';
  private show = false;
  colourStore: Colour =  Colour.getInstance();
  
  @Emit('onColourChange') 
  emitColour(): string {
    return this.colourStore.rgbColour;
  }

  colour(): string {
    return this.colourStore.rgbColour;
  }

 getPath(image: string): string {
    const path = require.context('@/assets/icons',false,/\.png$/);
    return path(`./${image}`);
  }
}
</script>