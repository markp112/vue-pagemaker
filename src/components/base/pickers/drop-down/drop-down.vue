<template>
  <div>
    <div class="flex flex-row justify-start relative w-16">
      <input
        v-model="selectedItem"
        class="min-w-6 text-sm text-center relative"
        @change="onInputChange"
      >
        <slot class="absolute right-0"/>
      <img :src="getPath('down-24.png')" 
        class="w-4 h-4 cursor-pointer hover:bg-gray-800"
        @click="show()"
        >
    </div>
  
      <ul class="border border-l-gray-500 bg-gray-200 flex flex-col items-center absolute z-10 w-12 shadow-lg h-32 overflow-y-scroll"
        v-if="toggleSelectOptions"
        @mouseleave="show"
        @blur="show"
      >
        <li v-for="item in $props.selectList"
          :key="item" 
          @click="itemClicked(item)" 
          class="drop-down-li"
          :class="{'bg-secondary-100 text-gray-200': item === selectedItem}">
          {{ item }}
        </li>
      </ul>
  
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit } from 'vue-property-decorator';

@Component({
  props: {
      selectList: { default: () => {
      return []
    }},
  },
})
export default class DropDown extends Vue {
  toggleSelectOptions = false;
  selectedItem = '10';

  @Emit('onSelectChange')
  itemClicked(classElement: string): string {
    this.selectedItem = classElement;
    this.show();
    return  classElement;
  }

  @Emit('onSelectChange')
  onInputChange() {
    return this.selectedItem;
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

<style lang="postcss">
.drop-down-li {
  @apply cursor-pointer mb-2 relative z-auto text-sm w-full text-center;
}

.drop-down-li:hover {
  @apply bg-gray-600 text-gray-400;
}
</style>
