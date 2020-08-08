<template>
  <div>
    <div class="sidebar-button-container relative">
      <img :src="getPath($props.buttonIconClassList.iconImage)" alt="">
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
        <li v-for="iconElement in $props.buttonIconClassList.classNames"
          :key="iconElement.className" 
          @click="iconClicked(iconElement)" 
          class="dropdown-menu-item mb-2 relative "
          :class="{'bg-secondary-100': iconElement.className === selectedItem}">
          <img :src="getPath(iconElement.iconImage)"
              class="w-8 h-8"
              :class="getClass(iconElement.className)"
              @mouseover="showToolTip=iconElement.classNameActive"
              @mouseleave="showToolTip=''"
              >
          <tool-tip :showToolTip="getShowToolTip(iconElement.classNameActive)" :tooltip="iconElement.tooltip"></tool-tip>
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
import { IconPickerInterface } from '@/models/components/icon-picker-models';
import { ButtonIconClassList } from '@/models/styles/builders/button-icon-class-list';
import { ButtonIconClassInterface } from '@/models/styles/button-icon/button-icon';
import { ButtonFactory } from '@/models//styles/button-factory/button-factory';
import { StyleElement } from '@/classes/text-attributes/text-attributes';


@Component({
  props: {
    buttonIconClassList: {
      default: () => {
        return  new ButtonFactory().createButton('class-list','border-styles');
      }},
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
  iconClicked(iconElement: ButtonIconClassInterface): StyleElement {
    this.$props.buttonIconClassList.update(iconElement);
    this.selectedItem = iconElement.classNameActive;
     const style: StyleElement = {
      styleName: this.$props.buttonIconClassList.classType,
      value: iconElement.classNameActive,
      units: 'px',
    }
    this.show();
    return style;
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
