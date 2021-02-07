<template>
  <div>
    <div class="text-primary-800 text-3xl mb-8">
      <p class="flex flex-row justify-between">
        Site Settings
        <span class="text-xl text-siteDark mb-2 ml-2 mt-4 ">
          Default Colours
        </span>
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
    <section class="w-full flex flex-row justify-center">
      <div class="w-8/12">
        <colour-palette
          class="justify-start"
          :palette="this.colourPalette.primary"
          label="Primary"
          @colourClicked="applyColour($event)"
        >
        </colour-palette>
        <colour-palette
          class="justify-start mt-2"
          :palette="this.colourPalette.secondary"
          label="Secondary"
          @colourClicked="applyColour($event)"
        >
        </colour-palette>
        <colour-palette
          class="justify-start mt-2"
          :palette="this.colourPalette.accent"
          label="Accent"
          @colourClicked="applyColour($event)"
        >
        </colour-palette>
        <colour-option
          class="mt-4"
          heading="Other Colour"
          :colour="selectedColour"
          @onChange="applyColour($event)"
        >
        </colour-option>
      </div>
    </section>
    <div class="flex flex-row justify-center text-siteLight mt-12">
      <div class="w-3/12">
        Click on item to apply colour to:
        <colour-pills
          class="mt-2"
          :pills="primary"
          @onChange="pillClicked($event)"
        ></colour-pills>
        <colour-pills
          class="mt-2"
          :pills="secondary"
          @onChange="pillClicked($event)"
        >
        </colour-pills>
        <colour-pills
          class="mt-2"
          :pills="other"
          @onChange="pillClicked($event)"
        ></colour-pills>
      </div>
      <div class="w-8/12 ">
        <material-template
          :materialSettings="siteDefaults"
          @itemSelected="setItemSelected($event)"
        ></material-template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Component from "vue-class-component";
import MaterialTemplate from "./partials/material-template/material-template.vue";
import ColourOption from "./partials/colour-option/colour-option.vue";
import FontSelect from "@/components/base/pickers/font-selector/font-selector.vue";
import Palette from "@/views/settings/pages/colour-palette/partials/colour-palette.vue";
import ColourPills, {
  Tuple
} from "@/views/settings/pages/site-defaults/partials/colour-pills/colour-pills.vue";
import { ColourProperties } from "./models/site-defaults";
import { ButtonIconNumeric } from "@/models/styles/button-icon/button-numeric-list/button-numeric-list";
import { ButtonFactory } from "@/models/styles/button-factory/button-factory";
import { SiteDefaults } from "@/classes/settings/site-defaults/site-defaults";
import { Notification } from "@/models/notifications/notifications";
import { SnackbarMixin } from "@/mixins/components/snackbar/snackbar-mixin";
import { ColourPalettes } from "@/classes/settings/colour-palette/colour-palette";
import { SiteIdAndUserId } from "@/models/site-and-user/site-and-user";

@Component({
  components: {
    "material-template": MaterialTemplate,
    "font-picker": FontSelect,
    "colour-option": ColourOption,
    "colour-palette": Palette,
    "colour-pills": ColourPills
  }
})
export default class SiteDefaultView extends SnackbarMixin {
  SAVE_ICON = "diskette-dark-48.png";
  SAVE_ICON_HOVER = "diskette-light-48.png";
  showDefaultIcon = true;
  dropDownSurface = "bg-siteSurface text-onSurface";
  siteDefaults: SiteDefaults = SiteDefaults.getInstance();
  colourPalette: ColourPalettes = new ColourPalettes("#000000");
  siteId = this.$store.getters.getCurrentSiteId;
  userId = this.$store.getters.currentUser.id;
  selectedColour = "#3322f4";
  selectedItem: ColourProperties = "primary";
  primary: Tuple[] = [
    ["primary - dark", "primaryDark"],
    ["primary", "primary"],
    ["primary - light", "primaryLight"],
    ["text on primary", "textOnPrimary"]
  ];
  secondary: Tuple[] = [
    ["secondary - dark", "secondaryDark"],
    ["secondary", "secondary"],
    ["secondary - light", "secondaryLight"],
    ["text on secondary", "textOnSecondary"]
  ];
  other: Tuple[] = [
    ["accent", "accent"],
    ["error", "error"],
    ["surface", "surface"],
    ["text on surface", "textOnSurface"],
    ["background", "background"],
    ["text on background", "textOnBackground"]
  ];

  fontSizeButton: ButtonIconNumeric = new ButtonFactory().createButton(
    "numeric",
    "font-size"
  ) as ButtonIconNumeric;

  mounted() {
    const siteAndUserId: SiteIdAndUserId = {
      siteId: this.siteId,
      userId: this.userId
    };
    this.colourPalette.loadPalette(siteAndUserId);
  }

  getPath(image: string): string {
    const path = require.context("@/assets/icons", false, /\.png$/);
    return path(`./${image}`);
  }

  pillClicked(colourItem: ColourProperties) {
    this.selectedItem = colourItem;
  }

  applyColour(colour: string) {
    this.siteDefaults.colours[this.selectedItem] = colour;
  }

  setItemSelected(item: ColourProperties) {
    this.selectedItem = item;
  }

  saveSiteDefaults() {
    this.siteDefaults
      .saveDefaults(this.siteId, this.userId)
      .then(response => {
        const notification = response as Notification;
        this.showSnackbar(notification, "Defaults saved");
      })
      .catch(err => {
        const notification = err as Notification;
        this.showSnackbar(notification, "Error Saving Defaults");
      });
  }
}
</script>
