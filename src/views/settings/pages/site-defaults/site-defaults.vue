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
    <div class="flex flex-row justify-start text-siteLight leading-8 ml-4 ">
      <section class="w-full flex flex-row ">
        <div class="w-5/12">
          <h2 class="text-xl text-siteDark ml-2">Font Settings</h2>
          <div class="flex flex-row justify-between w-6/12 mt-1">
            <p class="ml-8">Font</p>
            <font-picker
              @onChange="siteDefaults.typography.fontName"
            ></font-picker>
          </div>
          <div class="flex flex-row justify-between w-6/12 mt-1">
            <p class="ml-8">Font Size</p>
            <drop-down
              :thisIconButton="fontSizeButton"
              :surface="dropDownSurface"
              @onSelectChange="siteDefaults.typography.fontSizeBody"
            >
              px
            </drop-down>
          </div>
          <h2 class="text-xl text-siteDark mb-2 ml-2 mt-4">
            Colours
          </h2>
          <colour-option
            heading="Primary"
            :colour="siteDefaults.colours.primary"
            @onChange="siteDefaults.colours.primary = $event"
          >
          </colour-option>
          <colour-option
            heading="Primary Light"
            :colour="siteDefaults.colours.primaryLight"
            @onChange="siteDefaults.colours.primaryLight = $event"
          ></colour-option>
          <colour-option
            heading="Primary Dark"
            :colour="siteDefaults.colours.primaryDark"
            @onChange="siteDefaults.colours.primaryDark = $event"
          ></colour-option>
          <colour-option
            heading="Text on Primary"
            :colour="siteDefaults.colours.textOnPrimary"
            @onChange="siteDefaults.colours.textOnPrimary = $event"
          ></colour-option>
          <colour-option
            heading="Secondary"
            :colour="siteDefaults.colours.secondary"
            @onChange="siteDefaults.colours.secondary = $event"
          ></colour-option>
          <colour-option
            heading="Secondary Light"
            :colour="siteDefaults.colours.secondaryLight"
            @onChange="siteDefaults.colours.secondaryLight = $event"
          ></colour-option>
          <colour-option
            heading="Secondary Dark"
            :colour="siteDefaults.colours.secondaryDark"
            @onChange="siteDefaults.colours.secondaryDark = $event"
          ></colour-option>
          <colour-option
            heading="Text on Secondary"
            :colour="siteDefaults.colours.textOnSecondary"
            @onChange="siteDefaults.colours.textOnSecondary = $event"
          ></colour-option>
          <colour-option
            heading="Background"
            :colour="siteDefaults.colours.background"
            @onChange="siteDefaults.colours.background = $event"
          ></colour-option>
          <colour-option
            heading="Text on background"
            :colour="siteDefaults.colours.textOnBackground"
            @onChange="siteDefaults.colours.textOnBackground = $event"
          ></colour-option>
          <colour-option
            heading="Surface"
            :colour="siteDefaults.colours.surface"
            @onChange="siteDefaults.colours.surface = $event"
          ></colour-option>
          <colour-option
            heading="Text on surface"
            :colour="siteDefaults.colours.textOnSurface"
            @onChange="siteDefaults.colours.textOnSurface = $event"
          ></colour-option>
          <colour-option
            heading="Accent"
            :colour="siteDefaults.colours.accent"
            @onChange="siteDefaults.colours.accent = $event"
          ></colour-option>
          <colour-option
            heading="Error"
            :colour="siteDefaults.colours.error"
            @onChange="siteDefaults.colours.error = $event"
          ></colour-option>
        </div>
        <div class="w-7/12">
          <material-template
            :materialSettings="siteDefaults"
          ></material-template>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import MaterialTemplate from './partials/material-template/material-template.vue';
import ColourOption from './partials/colour-option/colour-option.vue';
import FontSelcect from '@/components/base/pickers/font-selector/font-selector.vue';
import DropDown from '@/components/base/pickers/drop-down/drop-down.vue';
import {
  siteDefaultSettings,
  SiteDefaultsInterface,
} from './models/site-defaults';
import { ButtonIconNumeric } from '@/models/styles/button-icon/button-numeric-list/button-numeric-list';
import { ButtonFactory } from '@/models/styles/button-factory/button-factory';
import { SiteDefaults } from '@/classes/settings/site-defaults/site-defaults';
import { Notification, notificationDefault } from '@/models/notifications/notifications';
import { SnackbarModule } from '@/store/snackbar/snackbar';
import { SnackbarMessage, SnackbarTypes } from '@/models/notifications/snackbar';

@Component({
  components: {
    'material-template': MaterialTemplate,
    'font-picker': FontSelcect,
    'drop-down': DropDown,
    'colour-option': ColourOption,
  },
})
export default class SiteDefaultView extends Vue {
  SAVE_ICON = 'diskette-dark-48.png';
  SAVE_ICON_HOVER = 'diskette-light-48.png';
  showDefaultIcon = true;
  dropDownSurface = "bg-siteSurface text-onSurface";
  siteDefaults: SiteDefaults = SiteDefaults.getInstance();

  fontSizeButton: ButtonIconNumeric = new ButtonFactory().createButton(
    'numeric',
    'fontSize'
  ) as ButtonIconNumeric;

  getPath(image: string): string {
    const path = require.context('@/assets/icons', false, /\.png$/);
    return path(`./${image}`);
  }

  saveSiteDefaults() {
    const siteId = this.$store.getters.getCurrentSiteId;
    const userId = this.$store.getters.currentUser.id;
    this.siteDefaults.saveDefaults(siteId, userId)
      .then (response => {
        const notification = response as Notification;
        const snackbarMessage: SnackbarMessage = {
          message:  notification.message,
          title: "saved",
          type: SnackbarTypes.Success,
          duration: 3000,
          show: true,
         }
        SnackbarModule.showSnackbar(snackbarMessage);
      })
    
  }
}
</script>
