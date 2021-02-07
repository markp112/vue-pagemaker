<template>
  <div class="sidebar-button-container relative">
    <div class="flex flex-row justify-start ">
      <img
        src="@/assets/icons/alphabet_latin-32.png"
        class="cursor-pointer hover:bg-gray-600"
      />
      <img
        src="@/assets/icons/down-24.png"
        class="w-4 h-4 cursor-pointer hover:bg-gray-800"
        @click="show()"
      />
    </div>
    <div
      v-if="toggleSelectOptions"
      class="absolute z-20 left-0 top-auto"
      @mouseleave="show"
      @blur="show"
    >
      <div class="flex flex-row justify-start">
        <span class="font-filter" @click="filterFonts('display')">d</span>
        <span class="font-filter" @click="filterFonts('handwriting')">h</span>
        <span class="font-filter" @click="filterFonts('monospace')">m</span>
        <span class="font-filter" @click="filterFonts('serif')">s</span>
        <span class="font-filter" @click="filterFonts('sans-serif')">ss</span>
      </div>
      <ul
        class="dropdown-menu-background flex flex-col items-start w-48 h-64 shadow-lg overflow-y-scroll"
      >
        <li
          v-for="font in listOfFonts"
          :key="font.fontName"
          @click="fontClicked(font.fontName)"
          class="dropdown-menu-item mb-2 relative z-auto text-sm w-full"
          :class="{ 'bg-secondary-100': font.fontName === selectedItem }"
          :style="{ 'font-family': font.fontName }"
        >
          {{ font.fontName }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Emit } from "vue-property-decorator";
import { Fonts, FontItemInterface } from "@/classes/fonts/fonts";
import { StyleElement } from "@/classes/text-attributes/text-attributes";

@Component
export default class FontSelect extends Vue {
  fonts: Fonts = Fonts.getInstance();
  toggleSelectOptions = false;
  selectedItem = "";
  fontList: FontItemInterface[] = [];

  created() {
    this.fontList = this.fonts.getListofFonts();
  }

  show() {
    this.toggleSelectOptions = !this.toggleSelectOptions;
  }

  @Emit("onChange")
  fontClicked(fontName: string): StyleElement {
    this.show();
    const style: StyleElement = {
      styleName: "font-family",
      value: fontName,
      units: ""
    };
    return style;
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
  @apply w-2/6 h-8 bg-gray-700 text-gray-300 inline-block p-1;
}

.font-filter:hover {
  @apply bg-gray-800 text-gray-200;
}
</style>
