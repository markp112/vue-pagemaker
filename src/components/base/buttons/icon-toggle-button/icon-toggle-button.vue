<template>
  <img
    :src="getPath($props.thisIconButton.iconImage)"
    class="text-accent-600 cursor-pointer hover:bg-gray-600"
    :class="{ 'bg-secondary-100': isActive }"
    @click="onClick" 
  />
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component';
  import { Emit } from 'vue-property-decorator';
  import { ButtonIconClassInterface } from '../../../../models/styles/button-icon/button-icon';
  import { ButtonIconClassBuilder } from '@/models/styles/builders/button-icon-class-builder';
import { StyleElement } from '../../../../classes/text-attributes/text-attributes';

  @Component({
  props: {
    thisIconButton: {
        default: (): ButtonIconClassInterface => {
          return new ButtonIconClassBuilder().build();
        },
      },
    },
  })
  export default class IconToggleButton extends Vue {
    name = 'IconToggleButton'
    isActive = false;

  @Emit("onChange")
  onClick(className: string) {
    this.isActive = !this.isActive;
    const style: StyleElement = {
      styleName: 'italic',
      value: '',
      units: 'px',
    }
    return style;
  }

  getPath(image: string): string {
      const path = require.context('@/assets/icons',false,/\.png$/);
      return path(`./${image}`);
    }
    
  }
</script>