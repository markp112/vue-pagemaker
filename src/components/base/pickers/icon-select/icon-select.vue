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
    <ul class="border border-gray-800 bg-gray-200 flex flex-col items-center absolute w-12"
      v-if="toggleSelectOptions"
    >
      <li v-for="iconElement in $props.iconList" :key="iconElement.class" @click="iconClicked(iconElement.class)">
        <img :src="getPath(iconElement.icon)" class="w-8 h-8 mb-2 hover:bg-gray-800" :class="iconElement.class">
      </li>
    </ul>
  </div>
  </div>

</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit } from 'vue-property-decorator';

interface IconListElement { icon: string, class: string };

@Component({
  props: {
    iconSelect: { default: '' },
    iconList: { default: () => {
      return []
    }}
  }
})
export default class IconSelect extends Vue {
  toggleSelectOptions = false;

  @Emit('selectChange')
  iconClicked(classElement: string): string {
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
}
</script>
