<template>
  <div class="flex flex-col justify-start w-full">
    <div class="section-wrapper">
      <p
        :style="{
          fontFamily: $props.materialSettings.typography.fontName,
          fontSize: $props.materialSettings.typography.fontSizeBody, 
        }"
      >
          <span class="block"> Font - {{ $props.materialSettings.typography.fontName }}</span>
          <span class="block"> Size - {{ $props.materialSettings.typography.fontSizeBody }}</span>
          <span class="bg-gray-400 border-gray-800 p-2 overflow-hidden block">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          </span>
        </p>  
    </div>
      <colour-palette :palette="this.colourPalette.primary" label="Primary"></colour-palette>
      <colour-palette :palette="this.colourPalette.secondary" label="Secondary"></colour-palette>
      <colour-palette :palette="this.colourPalette.accent" label="Accent"></colour-palette>
    <div class="flex flex-row justify-start w-full mt-6">
      <div class="flex flex-col justify-start w-6/12">
        <div 
          class="section-wrapper"
          :style="{ backgroundColor: $props.materialSettings.colours.primary }">
          <p class="w-full p-1"
            :style="{
              color: $props.materialSettings.colours.textOnPrimary,  
              backgroundColor: $props.materialSettings.colours.primaryDark,
            }"
          >
            Primary Dark
          </p>
          <p class="w-full p-1"
            :style="{ color: $props.materialSettings.colours.textOnPrimary }"
          >
            Primary
          </p>
          <p class="self-end w-full p-1"
            :style="{
              color: $props.materialSettings.colours.textOnPrimary,  
              backgroundColor: $props.materialSettings.colours.primaryLight }"
          >
            Primary Light
          </p>
        </div>
        <div 
          class="section-wrapper"
          :style="{ backgroundColor: $props.materialSettings.colours.secondary }">
          <p class="w-full p-1"
            :style="{
              color: $props.materialSettings.colours.textOnSecondary,  
              backgroundColor: $props.materialSettings.colours.secondaryDark,
            }"
          >
            Secondary Dark
          </p>
          
          <p class="w-full p-1"
            :style="{ color: $props.materialSettings.colours.textOnSecondary }"
          >
              Secondary
            </p>
          <p class="self-end w-full p-1"
            :style="{
              color: $props.materialSettings.colours.textOnSecondary,  
              backgroundColor: $props.materialSettings.colours.secondaryLight,
            }"
          >
            Secondary Light
          </p>
        </div>
      </div>
      <div class="flex flex-col justify-start w-6/12">
        <div 
          class="section-wrapper section-wrapper-short"
          :style="{ backgroundColor: $props.materialSettings.colours.error }">
          <p class="w-full p-1"
            :style="{
              color: $props.materialSettings.colours.textOnError,  
              backgroundColor: $props.materialSettings.colours.error,
            }"
          >
            Error
          </p>
        </div>
        <div class="section-wrapper section-wrapper-long">
          <div class="h-84"
            :style="{ backgroundColor: $props.materialSettings.colours.background }">
            <p class="p-1" :style="{ color: $props.materialSettings.colours.textOnBackground }">Text on background</p>
            <div class="p-5">
              <div class="w-full">
                <div class="p-1"
                  :style="{ backgroundColor: $props.materialSettings.colours.primary }">
                  <h2 :style="{ color: $props.materialSettings.colours.textOnPrimary }">
                    Text on primary
                  </h2>
                </div> 
                <div
                  class="h-32 p-1 relative"
                  :style="{
                    backgroundColor: $props.materialSettings.colours.surface,
                    color: $props.materialSettings.colours.textOnSurface,
                  }"
                  >
                    Text on surface
                  <div class="absolute bottom-1 left-1/3 h-16 w-16 rounded-full bg-white ml-2">
                    <p
                      class="absolute bottom-0 ml-2 mb-1 rounded-full h-12 w-12 flex items-center justify-center shadow-lg"
                      :style="{
                      backgroundColor: $props.materialSettings.colours.accent,
                      color: $props.materialSettings.colours.textOnSurface,
                    }"
                    >
                      accent
                    </p>
                  </div>
                </div>
                <div
                  class="p-1"
                    :style="{
                    backgroundColor: $props.materialSettings.colours.secondary,
                    color: $props.materialSettings.colours.textOnSecondary,
                  }"
                >
                  Text on secondary
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Palette from '@/views/settings/pages/colour-palette/partials/colour-palette.vue';
import { SiteDefaultsInterface } from '../../models/site-defaults';
import { ColourPalettes } from '@/classes/settings/colour-palette/colour-palette';
import { SiteIdAndUserId } from '@/models/site-and-user/site-and-user';

@Component({
  props: {
    materialSettings: {
      type: Object as () => SiteDefaultsInterface,
    },
  },
  components: {
    'colour-palette': Palette,
  },
})
export default class MaterialTemplate extends Vue {
  colourPalette: ColourPalettes = new ColourPalettes("#000000");
  siteId = this.$store.getters.getCurrentSiteId;
  userId = this.$store.getters.currentUser.id;

  mounted() {
    const siteAndUserId: SiteIdAndUserId = {
      siteId: this.siteId,
      userId: this.userId,
    };
    this.colourPalette.loadPalette(siteAndUserId);

  }
}
</script>

<style lang="postcss" scoped>
  .section-wrapper {
    @apply w-full;
    @apply h-40;
    @apply overflow-hidden;
    @apply flex;
    @apply flex-col;
    @apply justify-between;
    @apply text-sm;
  }
  
  .section-wrapper-short {
    @apply h-16;
  }

  .section-wrapper-long {
    @apply h-64;
  }
</style>