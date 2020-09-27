<template> 
  <div>
    <div class="text-primary-800 text-3xl mb-8">
      <p class="flex flex-row justify-between">
        Colour Palette
      </p>

    </div>

    <div class="flex flex-col justify-start ml-4">
      <div class="h-20 w-full flex flex-row justify-start flex-wrap">
        <p class="w-full">
          Primary
        </p>
        <span
          class="h-16 w-16 inline-block"
          v-for="colour in colourPalettes.primary"
          :key="colour"
          :style="{ backgroundColor: colour }"
        ></span>
      </div>
      <div class="h-20 w-full flex flex-row justify-start flex-wrap mt-4">
        <p class="w-full mb-2">
          Secondary
          </p>
        <span class="h-16 w-16 inline-block"
          v-for="colour in colourPalettes.secondary"
          :key="colour"
          :style="{ backgroundColor: colour }"
        ></span>
      </div>
      <div class="h-20 w-full flex flex-row justify-start flex-wrap mt-4">
        <p class="w-full mb-2">
          Accent
        </p>
        <span class="h-16 w-16 inline-block"
          v-for="colour in colourPalettes.accent"
          :key="colour"
          :style="{ backgroundColor: colour }"
        ></span>
      </div>
    </div>
  </div>
  
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { ColourPalettes } from '@/classes/settings/colour-palette/colour-palette';

@Component({})
export default class PaletteGenerator extends Vue {
  colourPalettes: ColourPalettes = new ColourPalettes('#ee443e'); 
  
  mounted() {
    this.colourPalettes = new ColourPalettes('#fe4c34');
  }

}
</script>