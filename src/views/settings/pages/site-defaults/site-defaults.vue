<template>
  <div>
    <div class="text-primary-800 text-3xl mb-8">
      <p class="flex flex-row justify-between">
        Site Settings
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
    <div class="w-full">
      <colour-palette
        class="justify-center"
        :palette="this.colourPalette.primary" 
        label="Primary"
        @colourClicked="applyColour($event)"
      >
      </colour-palette>
      <colour-palette
        class="justify-center"
        :palette="this.colourPalette.secondary"
        label="Secondary"
      >
      </colour-palette>
      <colour-palette
        class="justify-center"
        :palette="this.colourPalette.accent"
        label="Accent"
      >
      </colour-palette>
    </div>
    <div class="flex flex-row justify-start text-siteLight leading-8 ml-4 ">
      <div class="w-8/12">
        <h2 class="text-xl text-siteDark mb-2 ml-2 mt-4">
          Colours
        </h2>
        <div class="flex flex-row justify-evenly">
          <span class="w-6/12">
          <colour-option
            heading="Other Colour"
            :colour="selectedColour"
          >
          </colour-option>
          </span>
          <span>
            Apply colour to: {{ selectedItem }}
          </span>
        </div>
      </div>
    </div>
<div class="flex flex-row justify-start text-siteLight leading-8 ml-4 ">
        <div class="w-full">
          <material-template
            :materialSettings="siteDefaults"
          ></material-template>
        </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import MaterialTemplate from './partials/material-template/material-template.vue';
import ColourOption from './partials/colour-option/colour-option.vue';
import FontSelect from '@/components/base/pickers/font-selector/font-selector.vue';
import DropDown from '@/components/base/pickers/drop-down/drop-down.vue';
import Palette from '@/views/settings/pages/colour-palette/partials/colour-palette.vue';
import {
  ColourProperties,
  siteDefaultSettings,
  SiteDefaultsInterface,
} from './models/site-defaults';
import { ButtonIconNumeric } from '@/models/styles/button-icon/button-numeric-list/button-numeric-list';
import { ButtonFactory } from '@/models/styles/button-factory/button-factory';
import { SiteDefaults } from '@/classes/settings/site-defaults/site-defaults';
import { Notification, notificationDefault } from '@/models/notifications/notifications';
import { SnackbarModule } from '@/store/snackbar/snackbar';
import { SnackbarMessage, SnackbarTypes } from '@/models/notifications/snackbar';
import { SnackbarMixin } from '@/mixins/components/snackbar/snackbar-mixin';
import { ColourPalettes } from '@/classes/settings/colour-palette/colour-palette';
import { SiteIdAndUserId } from '@/models/site-and-user/site-and-user';

@Component({
  components: {
    'material-template': MaterialTemplate,
    'font-picker': FontSelect,
    'drop-down': DropDown,
    'colour-option': ColourOption,
    'colour-palette': Palette,
  },
})
export default class SiteDefaultView extends SnackbarMixin {
  SAVE_ICON = 'diskette-dark-48.png';
  SAVE_ICON_HOVER = 'diskette-light-48.png';
  showDefaultIcon = true;
  dropDownSurface = "bg-siteSurface text-onSurface";
  siteDefaults: SiteDefaults = SiteDefaults.getInstance();
  colourPalette: ColourPalettes = new ColourPalettes("#000000");
  siteId = this.$store.getters.getCurrentSiteId;
  userId = this.$store.getters.currentUser.id;
  selectedColour = "#3322f4";
  selectedItem: ColourProperties = 'primary';

  fontSizeButton: ButtonIconNumeric = new ButtonFactory().createButton(
    'numeric',
    'fontSize'
  ) as ButtonIconNumeric;

    mounted() {
    const siteAndUserId: SiteIdAndUserId = {
      siteId: this.siteId,
      userId: this.userId,
    };
    this.colourPalette.loadPalette(siteAndUserId);
  }

  getPath(image: string): string {
    const path = require.context('@/assets/icons', false, /\.png$/);
    return path(`./${image}`);
  }


  applyColour(colour: string) {
    
    this.siteDefaults.colours[this.selectedItem] = colour;
  }

  saveSiteDefaults() {
    this.siteDefaults.saveDefaults(this.siteId, this.userId)
      .then (response => {
        const notification = response as Notification;
        this.showSnackbar(notification, "Defaults saved");
      })
      .catch (err => {
        const notification = err as Notification;
        this.showSnackbar(notification, "Error Saving Defaults");
      })
    
  }
}
</script>
