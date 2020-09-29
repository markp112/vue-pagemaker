<template> 
  <section>
    <div class="text-primary-800 text-3xl mb-8">
      <p class="flex flex-row justify-between">
        Colour Palette
        <img
          v-show="showDefaultIcon"
          :src="getPath(SAVE_ICON)"
          class="w-10 h-10 mt-2 shadow cursor-pointer"
          @mouseenter="showDefaultIcon = !showDefaultIcon"
        />
        <img
          v-show="!showDefaultIcon"
          :src="getPath(SAVE_ICON_HOVER)"
          class="w-10 h-10 mt-2 shadow cursor-pointer"
          @mouseleave="showDefaultIcon = !showDefaultIcon"
          @click="saveSiteDefaults"
        />
      </p>
    </div>
    <div class="flex flex-row justify-start mb-4 w-full">
      <span class="px-2">Select base colour</span>
      <colour-dropdown  @onColourChange="onColourChange($event)"></colour-dropdown>
    </div>
    <p class="ml-8">scheme</p>
    <div class="flex flex-row justify-start w-full ml-8 mb-6 mt-0">
      <span class="w-2/12">
      <label for="complementary">complementary</label>
      <input 
        type="radio"
        name="colour-scheme"
        id="complementary"
        value="complementary"
        checked="true"
        @change="changeScheme('Complementary')">
      </span>
      <span class="w-2/12">
      <label for="analagous">analogous</label>
      <input type="radio" name="colour-scheme" id="analagous" value="analogous" @change="changeScheme('Analogous')">
      </span>
      <span class="w-2/12">
      <label for="triadic">triadic</label>
      <input type="radio" name="colour-scheme" id="triadic" value="triadic" @change="changeScheme('Triadic')">
      </span>
      <span class="w-2/12">
      <label for="compound">compound</label>
      <input type="radio" name="colour-scheme" id="compound" value="compound" @change="changeScheme('Compound')">
      </span>
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
import { ButtonIconNumeric } from '@/models/styles/button-icon/button-numeric-list/button-numeric-list';
import { ButtonFactory } from '@/models/styles/button-factory/button-factory';

@Component({
  components: {
    'colour-dropdown': ColourDropdown,
  },
})
export default class PaletteGenerator extends Vue {
  SAVE_ICON = 'diskette-dark-48.png';
  SAVE_ICON_HOVER = 'diskette-light-48.png';
  showDefaultIcon = true;
  colourPalettes: ColourPalettes = new ColourPalettes('#ee443e'); 
    fontSizeButton: ButtonIconNumeric = new ButtonFactory().createButton(
    'numeric',
    'fontSize'
  ) as ButtonIconNumeric;

  getPath(image: string): string {
    const path = require.context('@/assets/icons', false, /\.png$/);
    return path(`./${image}`);
  }


  mounted() {
    this.colourPalettes.colourScheme = 'Complementary';
    this.colourPalettes = new ColourPalettes('#fe4c34');
  }

  onColourChange(colour: string) {
    this.colourPalettes.newPalette(colour);
  }

  changeScheme(scheme: ColourSchemes) {
    this.colourPalettes.colourScheme = scheme;
    this.colourPalettes.newPalette(this.colourPalettes.colour);
  }
}
</script>