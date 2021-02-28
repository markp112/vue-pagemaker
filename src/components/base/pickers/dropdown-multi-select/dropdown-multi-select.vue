<template>
<div class="w-full md:w-1/2 flex flex-col items-center h-64 mx-auto">
  <div class="w-full px-4">
    <div class="flex flex-col items-center relative">
      <div class="w-full">
          <div class="my-2 p-1 flex border border-gray-200 bg-white rounded">
              <div class="flex flex-auto flex-wrap">
                <div
                  v-for="selectedItem in selectedItems"
                  :key="selectedItem"
                  class="flex justify-center items-center"
                >
                    <image-pill
                      :label="selectedItem"
                      size="small"
                      pillColour="bg-sitePrimary"
                      @removeClick="removeItem(selectedItem)"
                      ></image-pill>
                </div>
                  
                <div class="flex-1">
                  <input placeholder="" class="bg-transparent p-1 px-2 appearance-none outline-none h-full w-full text-gray-800">
                </div>
              </div>
              <div class="text-gray-300 w-8 py-1 pl-2 pr-1 border-l flex items-center border-gray-200 svelte-1l8159u">
                <button
                  @click="showDropdown=!showDropdown" 
                  class="cursor-pointer w-6 h-6 text-gray-600 outline-none focus:outline-none">
                    <svg v-if="!showDropdown" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-down w-4 h-4">
                        <polyline points="6,12 12,18 18,12"></polyline>
                    </svg>
                    <svg v-if="showDropdown" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-up w-4 h-4">
                        <polyline points="18 15 12 9 6 15"></polyline>
                    </svg>
                </button>
              </div>
          </div>
      </div>
      <div
        v-if="showDropdown"
        class="absolute shadow-md top-100 bg-white z-40 w-full left-0 rounded max-h-select overflow-y-auto"
      >
        <div class="flex flex-col w-full">
            <div
              v-for="listItem in listItems"
              :key="listItem"
              class="cursor-pointer w-full border-gray-100 rounded-t border-b ">
                <div
                  @click="itemClick(listItem)" 
                  class="flex w-full items-center p-2 pl-2 border-transparent border-l-4 relative rounded-l-md hover:border-site-secondary-light hover:bg-siteDark hover:text-siteSurface">
                  <div class="w-full items-center flex">
                      <div class="mx-2 leading-6  text-sm">{{ listItem }}</div>
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
  import ImagePill from '@/components/base/notifications/pills/image-pill/image-pill.vue'
  import { Emit } from 'vue-property-decorator';

  @Component({
    props: {
      listItems: {
        default: (): string[] => {
          return [];
        },
      },
    },
    components: {
      'image-pill': ImagePill,
    }
  })
  export default class DropdownMultiSelect extends Vue{
    name='dropdownMultiSelect';
    selectedItems: string[] = [];
    showDropdown = false;

    @Emit("itemClick")
    itemClick(item: string) {
      if (!this.selectedItems.includes(item)) {
        this.selectedItems.push(item);
      }
      return this.selectedItems;
    }

    @Emit("removeItem")
    removeItem(selectedItem: string) {
      this.selectedItems = this.selectedItems.filter(item => item !== selectedItem);
      return this.selectedItems;
    }

  }
</script>

<style scoped>
    .top-100 {top: 100%}
    .bottom-100 {bottom: 100%}
    .max-h-select {
        max-height: 300px;
    }
</style>