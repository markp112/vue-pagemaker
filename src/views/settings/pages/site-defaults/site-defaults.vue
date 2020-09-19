<template>
  <div class="flex flex-row justify-start text-siteLight leading-8 ml-4 ">
    <section class="w-full flex flex-row ">
      <div class="w-6/12">
      <h2 class="text-xl text-siteDark mb-2 ml-2">Font Settings</h2>
      <div class="flex flex-row justify-between w-4/12">
        <p class="ml-8">Font</p>
        <colour-dropdown @onColourChange="setFontColour($event)"></colour-dropdown>
      </div>
      <p class="ml-8">Font Size</p>
      <p class="ml-8">Font Colour</p>
      <p class="ml-8">Line Height</p>
      </div>
      <div class="w-6/12">
        <material-template :primary="primary"></material-template>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import MaterialTemplate from './partials/material-template/material-template.vue';
import ColourDropdown from '@/components/base/pickers/colour-picker/colour-dropdown.vue';

@Component({
  components: {
    'material-template': MaterialTemplate,
    'colour-dropdown': ColourDropdown,
  }
})
export default class SiteDefaults extends Vue {
  primary = "#2e453d"
  setFontColour(colour: string) {
    console.log('%c%s', 'color: #9c66cc', colour)
    this.primary = colour;
    
  }
}
</script>