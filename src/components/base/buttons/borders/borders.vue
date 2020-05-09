<template>
  <div>
  
    <div class="sidebar-button-panel">
        <div class="flex flex-row flex-start">
          <img src="@/assets/icons/thickness-32.png"
            class="text-accent cursor-pointer hover:bg-gray-600"
            :class="{'bg-secondary-100': isThicknessSelected}"
            @click="thicknessClick" />
          <div class="flex flex-col items-center" v-if="isThicknessSelected">
            <span class="icon-img minus h-4 inline-block w-4" @click="borderThicknessChange(-1)"></span>
            <span class="icon-img plus h-4 inline-block w-4" @click="borderThicknessChange(1)"></span>
          </div>
        </div>
        <div class="flex flex-row justify-start">
          <img src="@/assets/icons/bezier-32.png"
            class="text-accent cursor-pointer hover:bg-gray-600"
            :class="{'bg-secondary-100': isBorderRadiusSelected}"
            @click="onBorderRadiusChange" />
          <input v-if="isBorderRadiusSelected"
            type="number" 
            v-model="border.borderRadius.value" 
            size="3" class="w-8 bg-gray-300 border text-xs mb-1 ml-1" 
            @change="onUnitsChange()" />
          <select v-if="isBorderRadiusSelected"
            id="units" 
            class="bg-gray-300 border text-xs" 
            @click="onUnitsChange" 
            ref="unitSelect" 
            v-model="border.borderRadius.units">
            <optgroup>
              <option :value="'px'">px</option>
              <option :value="'%'">%</option>
              <option :value="'em'">em</option>
            </optgroup>
        </select>
      </div>
      <div class="flex flex-row justify-center">
        <icon-select iconSelect="project_stage_planning-32.png" :iconList="borderEdgeIconList" @selectChange="borderEdgeChange"></icon-select>
        <icon-select iconSelect="sketch-32.png" :iconList="lineStyleIconList" @selectChange="setLineStyle"></icon-select>
        <icon-select iconSelect="shadows-32.png" :iconList="shadowIconList" @selectChange="onShadowChange"></icon-select>
      </div>
    </div>
  </div>

</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import { Emit } from 'vue-property-decorator';
  import { Style, BorderDirections, BorderInterface, BorderStyle } from '@/models/styles/styles';
  import  IconSelect  from  '@/components/base/pickers/icon-select/icon-select.vue'

  @Component({
    components: {
      'icon-select': IconSelect,
    },
  })
  export default class BorderButtons extends Vue {
    name = 'border-buttons';
    selectedBorder: BorderDirections = null;
    isThicknessSelected = false;
    isBorderRadiusSelected = false;
    borderWeight = 1;
    borderStyle: Style = { style: 'border', value: '' };
    border: BorderInterface = {
      borderDirection: null,
      colour: 'rgba(0, 0, 0, 1)',
      style: 'solid',
      width: { value: 1, units: 'px' },
      borderRadius: { value: 0, units: 'px' },
    };
    shadowIconList = [
      { icon: 'check_box-32.png', class: 'shadow-sm', tooltip: 'small shadow' },
      { icon: 'check_box-32.png', class: 'shadow-md', tooltip: 'medium shadow' },
      { icon: 'check_box-32.png', class: 'shadow-lg', tooltip: 'large shadow' },
      { icon: 'check_box-32.png', class: 'shadow-xl', tooltip: 'extra large shadow' },
      { icon: 'check_box-32.png', class: 'shadow-2xl', tooltip: '2 times extra large shadow' },
      { icon: 'check_box-32.png', class: 'shadow-inner', tooltip: 'inner shadow' },
      { icon: 'check_box-32.png', class: 'shadow-outline', tooltip: 'outline shadow' },
      { icon: 'uncheck_box-32.png', class: 'shadow-none', tooltip: 'remove shadow' },
    ];
    lineStyleIconList = [
      { icon: 'solid-line-32.png', class: 'solid', tooltip: 'solid line' },
      { icon: 'dotted-line-32.png', class: 'dotted', tooltip: 'dotted line' },
      { icon: 'dashed-line-32.png', class: 'dashed', tooltip: 'dashed line' },
      { icon: 'double-line-32.png', class: 'double', tooltip: 'double line' },
      { icon: 'inset-32.png', class: 'inset', tooltip: 'inset' },
      { icon: 'outset-32.png', class: 'outset', tooltip: 'outset' },
      { icon: 'ridge-32.png', class: 'ridge', tooltip: 'ridge' },
      { icon: 'groove-32.png', class: 'groove', tooltip: 'groove' },
    ];
    borderEdgeIconList = [
      { icon: 'border_outside-32.png', class: 'border', tooltip: 'border all round' },
      { icon: 'border_top-32.png', class: 'top', tooltip: 'border top' },
      { icon: 'border_bottom-32.png', class: 'bottom', tooltip: 'border bottom' },
      { icon: 'border_left-32.png', class: 'left', tooltip: 'border left' },
      { icon: 'border_right-32.png', class: 'right', tooltip: 'border right' },
      { icon: 'border_none-32.png', class: 'none', tooltip: 'border none' },
      { icon: 'hidden-32.png', class: 'hidden', tooltip: 'hidden border' },
    ];

    @Emit('onBorderChange')
    setBorder(): BorderInterface {
      this.border.borderDirection = this.selectedBorder;
      this.border.width.value = this.borderWeight;
      return this.border;
    }
    
    @Emit('onRemoveStyle')
    removeStyle(style: BorderStyle) {
      if (style === 'none') {
        this.selectedBorder = null;
        this.isThicknessSelected = false;
        this.border.style = 'solid';
        return 'border';
      }
    }

    borderEdgeChange(edge: BorderDirections) {
      console.log('%c%s', 'color: #73998c', edge)
      this.selectedBorder = this.selectedBorder === edge ? null : edge;
      if (this.selectedBorder === edge) {
        this.setBorder();
      }
    }

    thicknessClick() {
      this.isThicknessSelected = !this.isThicknessSelected;
    }

    borderThicknessChange(amount: number) {
      if (this.borderWeight === 1 && amount === -1) {
        amount = -0.5;
      }
      this.borderWeight = this.borderWeight + amount < 0 ? 0 : this.borderWeight + amount;
      this.setBorder();
    }

    setLineStyle(lineStyle: BorderStyle) {
      this.border.style = lineStyle;
      if (lineStyle === 'double') this.borderWeight = 3;
      this.setBorder();
    }

    onBorderRadiusChange() {
      this.isBorderRadiusSelected = !this.isBorderRadiusSelected;
    }

    @Emit('onShadowChange')
    onShadowChange(classDef: string) {
      return classDef;
    }

    @Emit('onBorderChange')
    onUnitsChange(){
        return this.border;
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

  .bg-secondary-hidden {
    background-image: url("../../../../assets/icons/hidden-32.png");
  } 
  </style>