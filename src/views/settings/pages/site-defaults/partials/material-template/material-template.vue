<template>
  <div class="flex flex-col justify-start border-gray-800">
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
      <p class="w-full p-1"
        :style="{ color: $props.materialSettings.colours.textOnPrimary }">
          Text on Primary
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
      <p class="w-full p-1"
        :style="{ color: $props.materialSettings.colours.textOnSecondary }">
          Text on Secondary
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

</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { SiteDefaultsInterface } from '../../models/site-defaults';

@Component({
  props: {
    materialSettings: {
      type: Object as () => SiteDefaultsInterface,
    }
  }
})
export default class MaterialTemplate extends Vue {
  
}
</script>

<style lang="postcss" scoped>
  .section-wrapper {
    @apply w-6/12;
    @apply h-48;
    @apply overflow-hidden;
    @apply flex;
    @apply flex-col;
    @apply justify-between;
    @apply text-sm;
  }
</style>