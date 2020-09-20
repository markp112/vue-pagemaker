<template>
  <div class="flex flex-row justify-start text-siteLight leading-8 ml-4 ">
    <section class="w-full flex flex-row ">
      <div class="w-5/12">
        <h2 class="text-xl text-siteDark ml-2">Font Settings</h2>
        <div class="flex flex-row justify-between w-6/12 mt-1">
          <p class="ml-8">Font</p>
          <font-picker @onChange="setFont($event)"></font-picker>
        </div>
        <div class="flex flex-row justify-between w-6/12 mt-1">
          <p class="ml-8">Font Size</p>
          <drop-down 
            :thisIconButton="fontSizeButton"
            :surface="dropDownSurface"
            @onSelectChange="setFontSize($event)"
          >
            px
        </drop-down>
        </div>
        <h2 class="text-xl text-siteDark mb-2 ml-2 mt-4">Colours</h2>
          <colour-option
            heading="Primary"
            :colour="siteDefaults.colours.primary"
            @onChange="siteDefaults.colours.primary=$event"
          >
          </colour-option>
          <colour-option
            heading="Primary Light"
            :colour="siteDefaults.colours.primaryLight"
            @onChange="siteDefaults.colours.primaryLight=$event"
          >
          ></colour-option>
          <colour-option
            heading="Primary Dark"
            :colour="siteDefaults.colours.primaryDark"
            @onChange="siteDefaults.colours.primaryDark=$event"
          ></colour-option>
          <colour-option
            heading="Text on Primary"
            :colour="siteDefaults.colours.textOnPrimary"
            @onChange="siteDefaults.colours.textOnPrimary=$event"
          ></colour-option>
          <colour-option
            heading="Secondary"
            :colour="siteDefaults.colours.secondary"
            @onChange="siteDefaults.colours.secondary=$event"
          ></colour-option>
          <colour-option
            heading="Secondary Light"
            :colour="siteDefaults.colours.secondaryLight"
            @onChange="siteDefaults.colours.secondaryLight=$event"
          ></colour-option>
          <colour-option
            heading="Secondary Dark"
            :colour="siteDefaults.colours.secondaryDark"
            @onChange="siteDefaults.colours.secondaryDark=$event"
          ></colour-option>
           <colour-option
            heading="Text on Secondary"
            :colour="siteDefaults.colours.textOnSecondary"
            @onChange="siteDefaults.colours.textOnSecondary=$event"
          ></colour-option>
      </div>
      <div class="w-7/12">
        <material-template :materialSettings="siteDefaults" ></material-template>
      </div>

    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import MaterialTemplate from './partials/material-template/material-template.vue';
import ColourOption from './partials/colour-option/colour-option.vue';
import FontSelcect from '@/components/base/pickers/font-selector/font-selector.vue';
import DropDown from '@/components/base/pickers/drop-down/drop-down.vue';
import { Style } from '@/models/styles/styles';
import { siteDefaultSettings, SiteDefaultsInterface, } from './models/site-defaults';
import { ButtonIconNumeric } from '@/models/styles/button-icon/button-numeric-list/button-numeric-list';
import { ButtonFactory } from '@/models/styles/button-factory/button-factory';

@Component({
  components: {
    'material-template': MaterialTemplate,
    'font-picker': FontSelcect,
    'drop-down': DropDown,
    'colour-option': ColourOption,
  }
})
export default class SiteDefaults extends Vue {
  dropDownSurface="bg-siteSurface text-onSurface";
  siteDefaults: SiteDefaultsInterface = siteDefaultSettings;
  fontSizeButton: ButtonIconNumeric = new ButtonFactory().createButton('numeric', 'fontSize') as ButtonIconNumeric;
  
  setTextOnPrimary(colour: string) {
    this.siteDefaults.colours.textOnPrimary = colour;
    console.log('%c%s', 'color: #0088cc', this.siteDefaults.colours.textOnPrimary)
  }

  setPrimary(colour: string) {
    this.siteDefaults.colours.primary=colour;
  }

  setFont(style: Style) {
    this.siteDefaults.typography.fontName = style.value;
  }

  setFontSize(style: Style) {
    this.siteDefaults.typography.fontSizeBody = style.value + 'px';
  }


}
</script>