<template>
  <section class="w-auto z-10" @mouseleave="mouseLeave()">
    <div class="flex flex-row flex-wrap">
      <span
        class="h-8 w-8 flex flex-col justify-end cursor-pointer"
        v-for="(colour, index) in primaryColours"
        :key="index + colour"
        :style="{ backgroundColor: colour }"
        @click="colourClicked(colour)"
      >
      </span>
    </div>
    <div class="flex flex-row flex-wrap">
      <span
        class="h-8 w-8 flex flex-col justify-end cursor-pointer"
        v-for="(colour, index) in secondaryColours"
        :key="index + colour"
        :style="{ backgroundColor: colour }"
        @click="colourClicked(colour)"
      >
      </span>
    </div>
    <div class="flex flex-row flex-wrap">
      <span
        class="h-8 w-8 flex flex-col justify-end cursor-pointer"
        v-for="(colour, index) in accentColours"
        :key="index + colour"
        :style="{ backgroundColor: colour}"
        @click="colourClicked(colour)"
      >
      </span>
    </div>
    <p class="border-sitePrimary bg-siteSurface border-t-2 flex flex-row justify-end">
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
              @mouseleave="onMouseLeave"
            >
            </colour-picker>
          </template>
        </colour-dropdown>
    </p>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import ColourDropdown from '../colour-dropdown.vue';
import ColourPicker from '../colour-picker.vue';
import { SiteDefaults } from '@/classes/settings/site-defaults/site-defaults';
import { ColourPalettes } from '@/classes/settings/colour-palette/colour-palette';
import { AuthModule } from '@/store/auth/auth';
import { SitesModule } from '@/store/sites/sites'; 
import { SiteIdAndUserId } from '@/models/site-and-user/site-and-user';
import { Emit } from 'vue-property-decorator';
import { StyleElement } from '@/classes/text-attributes/text-attributes';
import { SidebarButtonEventManager } from '@/classes/sidebarButtonEventManager/sidebarButtonEventManager';
import { BackgroundBorderForeground, Colour } from '@/classes/colour/singleton-colour';

@Component({
  props: {
    show: { default: false } 
  },
  components: {
    'colour-dropdown': ColourDropdown,
    'colour-picker': ColourPicker,
  }
})
export default class ColourPaletteSidebar extends Vue {
  name = "ColourPaletteSidebar";
  textBackgroundorBorder: BackgroundBorderForeground = 'color';
  colour: Colour = Colour.getInstance();
  siteDefaults = SiteDefaults.getInstance();
  colourPalettes = new ColourPalettes();

  created() {
    this.colourPalettes = new ColourPalettes();
    const siteAndUserId: SiteIdAndUserId = {
      userId: AuthModule.currentUser.id,
      siteId: SitesModule.getCurrentSiteId,
    }
    this.colourPalettes.loadPalette(siteAndUserId);
  }
  
  @Emit('colour')
  colourClicked(colour: string) {
    return colour;
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

  @Emit("onMouseLeave")
  mouseLeave() {
    console.log("Left")
    return;
  }

  get primaryColours() {
    return this.colourPalettes.primary;
  }

  get secondaryColours() {
    return this.colourPalettes.secondary;
  }

  get accentColours() {
    return this.colourPalettes.accent;
  }

  getElementClass() {
     return 'ml-1'
  }

}
</script>

<style>

</style>