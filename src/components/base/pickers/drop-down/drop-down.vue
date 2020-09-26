<template>
  <div>
    <div class="flex flex-row justify-between relative w-12 text-sm">
      <input
        v-model="selectedItem"
        class="min-w-6 text-center relative app-input-field"
        :class="$props.surface"
        @change="onInputChange"
      >
      <img :src="getPath('down-24.png')" 
        class="w-4 h-4 cursor-pointer hover:bg-gray-800 absolute left-0"
        @click="show()"
        >
    </div>
    <ul
      class="dropdown-menu-background flex flex-col items-center absolute z-10 w-16 shadow-lg h-auto overflow-auto"
      v-if="toggleSelectOptions"
      @mouseleave="show"
      @blur="show"
    >
      <li
        v-for="item in $props.thisIconButton.valuesList"
        :key="item" 
        @click="itemClicked(item)" 
        class="dropdown-menu-item block w-full text-center mt-2"
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
import { ButtonIconNumeric } from '@/models/styles/button-icon/button-numeric-list/button-numeric-list';
import { ButtonIconNumericBuilder } from '@/models//styles/builders/button-icon-numeric';
import { StyleElement } from '@/classes/text-attributes/text-attributes';
import { BoxUnits } from '../../../../models/components/box-dimension';

@Component({
   props: {
    thisIconButton: {
        default: (): ButtonIconNumeric => {
          return new ButtonIconNumericBuilder().build();
        },
      },
    surface: {
      default: 'bg-primary-200 text-onPrimary',
    },
  },
})
export default class DropDown extends Vue {
  toggleSelectOptions = false;
  selectedItem = '';

  mounted () {
    console.log('%c%s', 'color: #00a3cc', this.$props.surface)

    this.selectedItem = this.$props.thisIconButton.defaultValue;
  }

  getSurface(): string {
    console.log('%c%s', 'color: #00a3cc', this.$props.surface)
    return this.$props.surface; 
  }

  @Emit('onSelectChange')
  itemClicked(classElement: string): StyleElement {
    const style: StyleElement = {
      styleName: this.$props.thisIconButton.style.style,
      value: classElement,
      units: this.$props.thisIconButton.units,
    }
    this.selectedItem = classElement;
    this.show();
    return style;
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
