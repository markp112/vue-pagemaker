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
      <ul class="dropdown-menu-background flex flex-col items-center absolute w-12 shadow-lg z-20"
        v-if="toggleSelectOptions"
        @mouseleave="show"
        @blur="show"
      >
        <li v-for="iconElement in $props.iconList"
          :key="iconElement.class" 
          @click="iconClicked(iconElement)" 
          class="dropdown-menu-item mb-2 relative "
          :class="{'bg-secondary-100': iconElement.class === selectedItem}">
          <img :src="getPath(iconElement.icon)"
              class="w-8 h-8"
              :class="getClass(iconElement.class)"
              @mouseover="showToolTip=iconElement.class"
              @mouseleave="showToolTip=''"
              >
          <tool-tip :showToolTip="getShowToolTip(iconElement.class)" :tooltip="iconElement.tooltip"></tool-tip>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit } from 'vue-property-decorator';
import ToolTip from '@/components/base/notifications/tooltip/tooltip.vue';
import { IconPickerInterface } from '../../../../models/components/icon-picker-models';

@Component({
  props: {
    iconSelect: { default: '' },
    iconList: { default: () => {
      return []
    }},
  },
  components: {
    'tool-tip' : ToolTip,
  },
})
export default class IconSelect extends Vue {
  toggleSelectOptions = false;
  selectedItem = '';
  showToolTip = '';

  @Emit('selectChange')
  iconClicked(iconElement: IconPickerInterface): IconPickerInterface {
    this.selectedItem = iconElement.class;
    this.show();
    return  iconElement;
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

  get getShowToolTip(): (classDef: string) => boolean {
    return (classDef: string) => this.showToolTip === classDef;
  }
}
</script>
