<template>
  <div>
    <div class="flex flex-row justify-start relative w-16">
      <input
        v-model="selectedItem"
        class="min-w-6 text-sm text-center relative app-input-field"
        @change="onInputChange"
      >
        <slot class="absolute right-0"/>
      <img :src="getPath('down-24.png')" 
        class="w-4 h-4 cursor-pointer hover:bg-gray-800"
        @click="show()"
        >
    </div>
    <ul
      class="dropdown-menu-background flex flex-col items-center absolute z-10 w-16 shadow-lg h-auto  overflow-auto"
      v-if="toggleSelectOptions"
      @mouseleave="show"
      @blur="show"
    >
      <li
        v-for="item in $props.selectList"
        :key="item" 
        @click="itemClicked(item)" 
        class="dropdown-menu-item block w-full text-center"
        :class="{'dropdown-menu-selected': item === selectedItem}">
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
    defaultValue: { default: '' },
  },
})
export default class DropDown extends Vue {
  toggleSelectOptions = false;
  selectedItem = '';

  mounted () {
    this.selectedItem = this.$props.defaultValue;
  }

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
