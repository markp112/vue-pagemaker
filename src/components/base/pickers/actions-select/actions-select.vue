<template>
  <div>
    <div class="sidebar-button-panel ">
      <span class="mb-2 p-1 font-semibold "> Navigate To</span>
      <div class="relative flex-row flex justify-start  ">
        <input
          v-model="selectedItem"
          class="min-w-12 w-auto text-sm mb-3 ml-2 app-input-field p-1"
          placeholder="enter external URL or select from list"
        />
        <img
          :src="getPath('down-24.png')"
          class="w-4 h-4 cursor-pointer hover:bg-gray-800 absolute right-0"
          @click="show()"
        />
        <ul
          class="dropdown-menu-background flex flex-col items-center absolute top-0 right-0 w-24 shadow-lg max-h-32"
          v-if="toggleSelectOptions"
          @mouseleave="show"
          @blur="show"
        >
          <li
            v-for="page in pages"
            :key="page"
            @click="itemClicked(page)"
            class="dropdown-menu-item w-full text-left block p-1"
            :class="{ 'bg-secondary-100 text-gray-200': page === selectedItem }"
          >
            {{ page }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { PagesModule } from "@/store/pages/pages";
import { Emit } from "vue-property-decorator";
import { ActionEvent } from "../../../../models/components/base-component";

@Component
export default class ActionsSelect extends Vue {
  pages: string[] = [];
  toggleSelectOptions = false;
  selectedItem = "";

  created() {
    PagesModule.pageList.forEach(page => {
      this.pages.push(page.name);
    });
  }

  @Emit("onActionSelect")
  itemClicked(page: string): ActionEvent {
    this.selectedItem = page;
    this.show();
    return new ActionEvent("Navigation", this.selectedItem);
  }

  show() {
    this.toggleSelectOptions = !this.toggleSelectOptions;
  }

  getPath(image: string): string {
    const path = require.context("@/assets/icons", false, /\.png$/);
    return path(`./${image}`);
  }
}
</script>

<style lang="postcss" scoped>
.actions-layout {
  @apply h-16 justify-start w-full flex-wrap mt-0 text-sm;
}

@screen md {
  .actions-layout {
    @apply flex-row;
    @apply flex-wrap;
  }
}
</style>
