<template> 
  <section>
    <div class="text-primary-800 text-3xl mb-8">
      <p class="flex flex-row justify-between">
        Colour Palette
      </p>
    </div>
    <div class="flex flex-row justify-center mb-4 w-full">
      <span class="px-2">Select base colour</span>
      <colour-dropdown  @onColourChange="onColourChange($event)"></colour-dropdown>
    </div>
    <div class="flex flex-col justify-start ml-8">
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
  </section>
  
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { ColourPalettes, ColourSchemes } from '@/classes/settings/colour-palette/colour-palette';
import ColourDropdown from '@/components/base/pickers/colour-picker/colour-dropdown.vue'; 

@Component({
  components: {
    'colour-dropdown': ColourDropdown,
  },
})
export default class PaletteGenerator extends Vue {
  colourPalettes: ColourPalettes = new ColourPalettes('#ee443e'); 
  
  mounted() {
    this.colourPalettes = new ColourPalettes('#fe4c34');
  }

  onColourChange(colour: string) {
    this.colourPalettes.colourScheme = 'Analogous';
    this.colourPalettes.newPalette(colour);
  }
}
</script>