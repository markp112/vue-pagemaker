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
          @click="saveColourPalette()"
          :colour-prop="colourPalettes.colour"
        />
      </p>
    </div>
    <div class="flex flex-row justify-start mb-4 w-full">
      <span class="px-2">Select base colour</span>
      <colour-dropdown 
        @onColourChange="onColourChange($event)"
        :colourProp="colourPalettes.colour"
      >
      </colour-dropdown>
      <div class="ml-12 flex flex-col justify-start">
        <label for="saturation">saturation</label>
        <input
          type="range"
          min="-100"
          max="100"
          value="0"
          class="slider"
          id="saturation"
          v-model="saturationValue"
          @input="onSaturationChange()"
        >
      </div>
      <div class="self-end ml-16">
        <span
          class="reset-button"
          @click="onResetClick()"
        >
          Reset
        </span>
      </div>
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
        :checked="isThisColourScheme('Complementary')"
        @change="changeScheme('Complementary')">
      </span>
      <span class="w-2/12">
      <label for="analagous">analogous</label>
      <input
        type="radio"
        name="colour-scheme"
        id="analagous"
        value="analogous"
        :checked="isThisColourScheme('Analogous')"
        @change="changeScheme('Analogous')">
      </span>
      <span class="w-2/12">
      <label for="triadic">triadic</label>
      <input
        type="radio"
        name="colour-scheme"
        id="triadic"
        value="triadic"
        :checked="isThisColourScheme('Triadic')"
        @change="changeScheme('Triadic')">
      </span>
      <span class="w-2/12">
      <label for="compound">compound</label>
      <input
        type="radio"
        name="colour-scheme"
        id="compound"
        value="compound"
        :checked="isThisColourScheme('Compound')"
        @change="changeScheme('Compound')">
      </span>
    </div>
    <div class="flex flex-col justify-start ml-8">
      <palette-strip
        :palette="colourPalettes.primary"
        label="Primary"
        @colourClicked="paletteColourClicked($event)"
      >
      </palette-strip>
      <palette-strip
        class="mt-8"
        :palette="colourPalettes.secondary"
        label="Secondary"
        @colourClicked="paletteColourClicked($event)"
      >
      </palette-strip>
      <palette-strip
        class="mt-8"
        :palette="colourPalettes.accent"
        label="Accent"
        @colourClicked="paletteColourClicked($event)"
      >
      </palette-strip>

    </div>
  </section>
  
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { ColourPalettes, ColourSchemes, PalettesInterface } from '@/classes/settings/colour-palette/colour-palette';
import ColourDropdown from '@/components/base/pickers/colour-picker/colour-dropdown.vue'; 
import { ButtonIconNumeric } from '@/models/styles/button-icon/button-numeric-list/button-numeric-list';
import { ButtonFactory } from '@/models/styles/button-factory/button-factory';
import { SiteIdAndUserId } from '@/models/site-and-user/site-and-user';
import { SiteAndUserId } from '@/classes/site-and-user/SiteAndUserId';
import { SnackbarMixin } from '@/mixins/components/snackbar/snackbar-mixin';
import { Notification } from '@/models/notifications/notifications';
import PaletteStrip from './partials/colour-palette.vue';

@Component({
  components: {
    'colour-dropdown': ColourDropdown,
    'palette-strip': PaletteStrip,
  },
})
export default class PaletteGenerator extends SnackbarMixin {
  name = 'colour-palettes';
  SAVE_ICON = 'diskette-dark-48.png';
  SAVE_ICON_HOVER = 'diskette-light-48.png';
  showDefaultIcon = true;
  saturationPreviousValue = 0;
  saturationValue = 0;
  colourPalettes: ColourPalettes = new ColourPalettes('#ee443e'); 
    fontSizeButton: ButtonIconNumeric = new ButtonFactory().createButton(
    'numeric',
    'font-size'
  ) as ButtonIconNumeric;

  getPath(image: string): string {
    const path = require.context('@/assets/icons', false, /\.png$/);
    return path(`./${image}`);
  }

  mounted() {
    this.loadPalette();
  }

  isThisColourScheme(colourScheme: ColourSchemes): boolean {
    return this.colourPalettes.colourScheme === colourScheme;
  }

  onColourChange(colour: string) {
    this.saturationValue = 0;
    this.saturationPreviousValue = 0;
    this.colourPalettes.newPalette(colour);
  }

  onResetClick() {
    this.loadPalette();
  }

  onSaturationChange() {
    const value = this.saturationValue > this.saturationPreviousValue ? 0.1 : -0.1;
    this.colourPalettes.changeSaturation(value);
    this.saturationPreviousValue = this.saturationValue;
  }

  changeScheme(scheme: ColourSchemes) {
    this.colourPalettes.colourScheme = scheme;
    this.colourPalettes.newPalette(this.colourPalettes.colour);
  }

  saveColourPalette() {
    const siteAndUserId = this.getSiteAndUserID(); 
    this.colourPalettes.savePalette(siteAndUserId)
    .then (response => {
      const notification = response as Notification;
      this.showSnackbar(notification, 'Palettes Saved');
    })
    .catch(err => {
      const notification = err as Notification;
      this.showSnackbar(notification, 'Error saving Palettes');
    });
  }

  loadPalette() {
    const siteAndUserId = this.getSiteAndUserID();
    this.colourPalettes.loadPalette(siteAndUserId);
  }

  private paletteColourClicked(colour: string) {
    this.onColourChange(colour);
  }

  private getSiteAndUserID():SiteIdAndUserId {
    return {
      siteId: this.$store.getters.getCurrentSiteId,
      userId: this.$store.getters.currentUser.id,
    };
  }
}
</script>

<style scoped>
.slider {
  -webkit-appearance: none;
  width: 100%;
  height: 12px;
  border-radius: 5px;  
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
  -webkit-transition: .2s;
  transition: opacity .2s;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%; 
  background: #4a3d94;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #4a3d94;
  cursor: pointer;
}

.reset-button {
  @apply rounded-full;
  @apply w-auto;
  @apply h-auto;
  @apply ml-4;
  @apply text-xs;
  @apply px-4;
  @apply py-2;
  @apply bg-siteLight;
  @apply text-onPrimary;
  @apply border-gray-600;
  @apply border;
  @apply cursor-pointer;
}
.reset-button:hover {
  @apply bg-site-secondary-light;
  @apply text-onPrimary;
}
</style>
