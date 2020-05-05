<template>
  <div>
    <div class="button-panel p-2">
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
    <div class="button-panel mt-1 p-1">
      <div class="flex flex-row flex-start">
        <img src="@/assets/icons/thickness-32.png"
          class="text-accent cursor-pointer hover:bg-gray-600"
          :class="{'bg-secondary-100': isThicknessSelected}"
          @click="thicknessClick" />
        <div class="flex flex-col items-center" v-if="isThicknessSelected">
         <span class="icon-img minus h-4 inline-block w-4"></span>
         <span class="icon-img plus h-4 inline-block w-4"></span>
        </div>
      </div>
    </div>
  </div>
</template>



<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import { Emit } from 'vue-property-decorator';
  import { Style, BorderDirections } from '@/models/styles/styles';

  

  @Component
  export default class BorderButtons extends Vue {
    name = 'border-buttons';
    selectedBorder: BorderDirections = null;
    isThicknessSelected = false;
    borderStyle: Style = {style: 'border', value: ''}


  @Emit('onBorderChange')
  setBorder() {
    const style: Style ={
      style: this.selectedBorder === 'border' ? `border` : `border-${this.selectedBorder}`,
      value: 'solid 1px rgba(123, 4, 100,1)'
    };
  
    return style;
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
      this.selectedBorder = this.selectedBorder === 'border' ? null : 'border';
      if (this.selectedBorder === 'border') {
        this.setBorder();
      }
    }

    thicknessClick(){
      this.isThicknessSelected = !this.isThicknessSelected;
    }
  }
  </script>

  <style lang="postcss" scoped>
  .button-panel {
    @apply flex flex-row justify-evenly text-xl bg-gray-300 h-10;
  }

  .icon-img {
    background-size: 16px 16px;
    background-position: center;
  }

  .plus {
    background-image: url("../../../../assets/icons/plus-24.png");
    
  }

  .plus:hover{
    background-image: url("../../../../assets/icons/plus-olive-24.png");
  }

  .minus {
    background-image: url("../../../../assets/icons/minus-24.png");
  }

 .minus:hover{
    background-image: url("../../../../assets/icons/minus-olive-24.png");
  }

  </style>