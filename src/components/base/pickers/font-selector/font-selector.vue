<template>
  <div>
    <div class="flex flex-row justify-start relative">
      <img src="@/assets/icons/alphabet_latin-32.png"
            class="text-accent cursor-pointer hover:bg-gray-600"
      />
      <img src="@/assets/icons/down-24.png" 
        class="w-4 h-4 cursor-pointer hover:bg-gray-800"
        @click="show()"
        >
    </div>
    <div v-if="toggleSelectOptions" class="absolute z-20">
      <div class="flex flex-row justify-start">
        <span class="font-filter" @click="filterFonts('display')">d</span>
        <span class="font-filter" @click="filterFonts('handwriting')">h</span>
        <span class="font-filter" @click="filterFonts('monospace')">m</span>
        <span class="font-filter" @click="filterFonts('serif')">s</span>
        <span class="font-filter" @click="filterFonts('sans-serif')">ss</span>
      </div>
      <ul class="border border-l-gray-500 bg-gray-200 flex flex-col items-start w-32 h-64 shadow-lg overflow-y-scroll"
        @mouseleave="show"
        @blur="show"
      >
        <li v-for="font in listOfFonts"
          :key="font.fontName" 
          @click="fontClicked(font.fontName)" 
          class="cursor-pointer mb-2 relative z-auto text-sm w-full hover:bg-gray-600 hover:text-gray-200"
          :class="{'bg-secondary-100': font.fontName === selectedItem}"
          :style="{'font-family': font.fontName}"
          >
          {{ font.fontName }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit } from 'vue-property-decorator';
import { Fonts, FontItemInterface } from '@/classes/fonts/fonts';

@Component
export default class FontSelect extends Vue {
  fonts: Fonts = Fonts.getInstance();
  toggleSelectOptions = false;
  selectedItem = '';
  fontList: FontItemInterface[] = [];
  
  created() {
    this.fontList = this.fonts.getListofFonts();
  }
  
  show() {
    this.toggleSelectOptions = !this.toggleSelectOptions;
  }

  @Emit('onFontClick')
  fontClicked(fontName: string) {
    this.show();
    return fontName;
  }

  filterFonts(filterBy: string) {
    this.fontList = this.fonts.filterFonts(filterBy);
  }

  get listOfFonts(): FontItemInterface[] {
    return this.fontList;
  }
}
</script>

<style lang="postcss">
.font-filter {
  @apply w-2/6 h-8 bg-gray-500 text-gray-300 inline-block p-1;
}

.font-filter:hover {
  @apply bg-gray-800 text-gray-200;
}
</style>