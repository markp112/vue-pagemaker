<template>
  <section>
    <div class="sidebar-button-panel h-12 items-start text-accent-600 p-1">
      <p>Border Styles</p>
      <icon-select iconSelect="project_stage_planning-32.png" :iconList="borderEdgeIconList" @selectChange="borderEdgeChange"></icon-select>
      <icon-select iconSelect="sketch-32.png" :iconList="lineStyleIconList" @selectChange="setLineStyle"></icon-select>
      <icon-select iconSelect="shadows-32.png" :iconList="shadowIconList" @selectChange="onShadowChange"></icon-select>
    </div>
    <div class="sidebar-button-panel h-12 justify-evenly">
      <div class="flex flex-row justify-start">
        <img
          src="@/assets/icons/thickness-32.png"
          class="text-accent-600 cursor-pointer hover:bg-gray-600"
          :class="{'bg-secondary-100': isThicknessSelected}"
          @click="thicknessClick" />
        <div class="flex flex-col items-center" >
          <span class="icon-img minus h-4 inline-block w-4" @click="borderThicknessChange(-1)"></span>
          <span class="icon-img plus h-4 inline-block w-4" @click="borderThicknessChange(1)"></span>
        </div>
      </div>
      <div class="flex flex-row items-center justify-between">
        <img src="@/assets/icons/bezier-32.png"
          class="text-accent-600 cursor-pointer hover:bg-gray-600"
          :class="{'bg-secondary-100': isBorderRadiusSelected}"
          />
        <input
          type="number" 
          v-model="border.borderRadius.value" 
          size="2" 
          class="w-8 app-input-field text-sm mb-1 ml-1 mr-1 text-right" 
          @change="onBorderRadiusChange()" />
        <drop-down
          :selectList="borderUnits"
          defaultValue="px"
          @onSelectChange="onUnitsChange"
        >
        </drop-down>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import { Emit } from 'vue-property-decorator';
  import { Style, BorderDirections, BorderInterface, BorderStyle } from '@/models/styles/styles';
  import IconSelect  from  '@/components/base/pickers/icon-select/icon-select.vue';
  import DropDown  from '@/components/base/pickers/drop-down/drop-down.vue';
  import {
    IconPickerInterface,
    shadowIconList,
    lineStyleIconList,
    borderEdgeIconList } from '@/models/components/icon-picker-models';
import { BoxUnits } from '../../../../models/components/box-dimension';
  @Component({
    components: {
      'icon-select': IconSelect,
      'drop-down': DropDown,
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
    shadowIconList = shadowIconList;
    lineStyleIconList = lineStyleIconList;
    borderEdgeIconList  = borderEdgeIconList;
    borderUnits = ['px', 'em', '%'];

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

    borderEdgeChange(iconElement: IconPickerInterface) {
      const edge: BorderDirections = iconElement.class as BorderDirections;
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

    setLineStyle(iconElement: IconPickerInterface) {
      const lineStyle: BorderStyle = iconElement.class as BorderStyle;
      this.border.style = lineStyle;
      if (lineStyle === 'double') this.borderWeight = 3;
      this.setBorder();
    }

    @Emit('onShadowChange')
    onShadowChange(iconElement: IconPickerInterface) {
      return iconElement.class;
    }

    @Emit('onBorderChange')
    onUnitsChange(borderUnits: BoxUnits) {
      this.border.borderRadius.units = borderUnits;
      return this.border;
    }
    
    @Emit('onBorderChange')
    onBorderRadiusChange(){
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