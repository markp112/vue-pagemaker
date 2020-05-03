<template>
  <div>
    <div class="button-panel">
    <img src="@/assets/icons/border_outside-32.png"
      class="text-accent cursor-pointer hover:bg-gray-600"
      :class="{'bg-secondary-100': selectedBorder === 'outside'}"
      @click="borderOutsideClick" />
    <img src="@/assets/icons/border_top-32.png"
      class="text-accent cursor-pointer hover:bg-gray-600"
      :class="{'bg-secondary-100': selectedBorder === 'top'}"
      @click="borderTopClick" />
    <img src="@/assets/icons/border_bottom-32.png"
      class="text-accent cursor-pointer hover:bg-gray-600"
      :class="{'bg-secondary-100': selectedBorder === 'bottom'}"
      @click="borderBottomClick" />
    <img src="@/assets/icons/border_left-32.png"
      class="text-accent cursor-pointer hover:bg-gray-600"
      :class="{'bg-secondary-100': selectedBorder === 'left'}"
      @click="borderLeftClick" />
    <img src="@/assets/icons/border_right-32.png"
      class="text-accent cursor-pointer hover:bg-gray-600"
      :class="{'bg-secondary-100': selectedBorder === 'right'}"
      @click="borderRightClick" />
    </div>
    <div class="button-panel mt-1">
      <img src="@/assets/icons/thickness-32.png"
      class="text-accent cursor-pointer hover:bg-gray-600"
      @click="thicknessClick" />
    </div>
  </div>
</template>



<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import { Emit } from 'vue-property-decorator';
  import { Style } from '@/models/page/page';

type Borders = 'top' | 'bottom' | 'left' | 'right' | 'outside' | null

  @Component
  export default class BorderButtons extends Vue {
    name = 'border-buttons';
    selectedBorder: Borders = null;
    
    borderStyle: Style = {style: 'border', value: ''}


  @Emit('onBorderChange')
  setBorder() {
    this.selectedBorder === 'outside' ? this.borderStyle.style = `border` :  this.borderStyle.style = `border-${this.selectedBorder}`;
    this.borderStyle.value = 'solid 1px rgba(123, 4, 100,1)'
    return this.borderStyle;
  }
    
    borderBottomClick() {
      this.selectedBorder = this.selectedBorder === 'bottom' ? null : 'bottom';
      if (this.selectedBorder === 'bottom') {
        this.setBorder();
      }
    }

    borderTopClick() {
      this.selectedBorder = this.selectedBorder === 'top' ? null : 'top';
      if (this.selectedBorder === 'top') {
        this.setBorder();
      }
    }

    borderLeftClick() {
      this.selectedBorder = this.selectedBorder === 'left' ? null : 'left';
      if (this.selectedBorder === 'left') {
        this.setBorder();
      }
    }
    
    borderRightClick() {
      this.selectedBorder = this.selectedBorder === 'right' ? null : 'right';
      if (this.selectedBorder === 'right') {
        this.setBorder();
      }
    }

  borderOutsideClick(){
      this.selectedBorder = this.selectedBorder === 'outside' ? null : 'outside';
      if (this.selectedBorder === 'outside') {
        this.setBorder();
      }
    }

    thicknessClick(){
      return;
    }
  }
  </script>

  <style lang="postcss" scoped>
  .button-panel {
    @apply flex flex-row justify-evenly text-xl bg-gray-300 p-2 h-10;
  }
  </style>