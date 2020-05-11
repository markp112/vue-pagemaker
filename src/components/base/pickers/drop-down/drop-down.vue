<template>
  <div>
    <div class="flex flex-row justify-start relative">
      <img :src="getPath(iconSelect)" alt="">
      <img :src="getPath('down-24.png')" 
        class="w-4 h-4 cursor-pointer hover:bg-gray-800"
        @click="show()"
        >
    </div>
    <div>
      <ul class="border border-l-gray-500 bg-gray-200 flex flex-col items-center absolute w-12 shadow-lg"
        v-if="toggleSelectOptions"
        @mouseleave="show"
        @blur="show"
      >
        <li v-for="item in $props.selectList"
          :key="item" 
          @click="iconClicked(item)" 
          class="cursor-pointer mb-2 relative z-auto"
          :class="{'bg-secondary-100': item === selectedItem}">
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit } from 'vue-property-decorator';

@Component({
  props: {
    iconSelect: { default: '' },
    selectList: { default: () => {
      return []
    }},
  },
})
export default class DropDown extends Vue {
  toggleSelectOptions = false;
  selectedItem = '';

  @Emit('selectChange')
  iconClicked(classElement: string): string {
    this.selectedItem = classElement;
    this.show();
    return  classElement;
  }

  show() {
    this.toggleSelectOptions = !this.toggleSelectOptions;
  }

  getPath(image: string): string {
    const path = require.context('@/assets/icons',false,/\.png$/);
    return path(`./${image}`);
  }
  
  getClass(classDef: string ) {
    return classDef === 'hidden' ? '' : classDef 
  }
}
</script>
