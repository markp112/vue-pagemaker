<template>
  <div>
    <div class="sidebar-button-panel h-4 justify-start w-full p-1">
      <div class="text-sm w-6/6 ">Actions</div>
    </div>
    <div class="sidebar-button-panel h-16 justify-start w-full flex-wrap mt-0">
      <div class="text-xs flex flex-row justify-start items-center relative">
        <span class="mb-2 p-1"> Navigate To</span>
        <div class="relative flex-row flex justify-start">
          <input
            v-model="selectedItem"
            class="min-w-6 text-sm mb-3 ml-2"
            placeholder="enter external URL or select from list"
          />
          <img
            :src="getPath('down-24.png')" 
            class="w-4 h-4 cursor-pointer hover:bg-gray-800"
            @click="show()"
          />
          <ul
            class="border border-l-gray-500 bg-gray-200 flex flex-col items-center absolute w-12 shadow-lg max-h-32 top-0"
            v-if="toggleSelectOptions"
            @mouseleave="show"
            @blur="show"
          >
            <li
              v-for="page in pages"
              :key="page" 
              @click="itemClicked(page)" 
              class="drop-down-li"
              :class="{'bg-secondary-100 text-gray-200': page === selectedItem}">
              {{ page }}
            </li>
          </ul>
        </div>
      </div> 
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { PagesModule } from '@/store/pages/pages';
import { Emit } from 'vue-property-decorator';
import { ActionEvent } from '../../../../models/components/base-component';

@Component
export default class ActionsSelect extends Vue {
  pages: string [] = [];
  toggleSelectOptions = false;
  selectedItem = '';  

  created() {
    PagesModule.pageList.forEach(page => { 
      this.pages.push(page.name);
    });
  }

  @Emit('onActionSelect')
  itemClicked(page: string): ActionEvent {
    this.selectedItem = page;
    this.show();
    return new ActionEvent('Navigation', this.selectedItem);
  }

  show() {
    this.toggleSelectOptions = !this.toggleSelectOptions;
  }

  getPath(image: string): string {
    const path = require.context('@/assets/icons',false,/\.png$/);
    return path(`./${image}`);
  }
}
</script>
