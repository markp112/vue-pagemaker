<template>
  <div>
    <div class="text-primary-800 text-3xl mb-8">
      <p class="flex flex-row justify-between">
        Site Font Settings
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
        </div>
        <div class="w-8/12 flex flex-row">
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
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default class FontDefaults extends Vue {

}
  
</script>