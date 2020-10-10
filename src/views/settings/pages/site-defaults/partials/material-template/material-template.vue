<template>
  <div class="flex flex-col justify-start w-full">
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
            <div class="p-5 flex flex-row justify-center">
              <div class="w-8/12 shadow-lg">
                <div 
                  class="p-1"
                  :style="{
                    backgroundColor: $props.materialSettings.colours.primary,
                  }"
                >
                  <h2
                    :style="{
                      color: $props.materialSettings.colours.textOnPrimary,
                    }">
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
                  <div class="absolute bottom-1 left-1/3 h-16 w-16 rounded-full ml-2"
                    :style="{
                      backgroundColor: $props.materialSettings.colours.surface,
                    }"
                  >
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
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { SiteDefaultsInterface } from '../../models/site-defaults';

@Component({
  props: {
    materialSettings: {
      type: Object as () => SiteDefaultsInterface,
    },
  },
  components: {
  },
})
export default class MaterialTemplate extends Vue {}
</script>

<style lang="postcss" scoped>
.section-wrapper {
  @apply w-full;
  @apply h-48;
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
  @apply h-84;
}
</style>
