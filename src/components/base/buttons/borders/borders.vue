<template>
  <section>
      <p>Border Styles</p>
    <div class="sidebar-button-panel h-12 items-start text-accent-600 p-1">
      <icon-select iconSelect="project_stage_planning-32.png" :iconList="borderEdgeIconList" @selectChange="borderEdgeChange"></icon-select>
      <icon-select iconSelect="sketch-32.png" :iconList="lineStyleIconList" @selectChange="setLineStyle"></icon-select>
      <icon-select iconSelect="shadows-32.png" :iconList="shadowIconList" @selectChange="onShadowChange"></icon-select>
    </div>
    <div class="sidebar-button-panel h-12 justify-evenly mt-2">
      <div class="flex flex-row justify-start">
        <img
          src="@/assets/icons/thickness-32.png"
          class="text-accent-600 cursor-pointer hover:bg-gray-600"
       />
        <div class="flex flex-col items-center" >
          <span class="icon-img minus h-4 inline-block w-4" @click="borderThicknessChange(-1)"></span>
          <span class="icon-img plus h-4 inline-block w-4" @click="borderThicknessChange(1)"></span>
        </div>
      </div>
      <div class="flex flex-row items-center justify-between">
        <img src="@/assets/icons/bezier-32.png"
          class="text-accent-600 cursor-pointer hover:bg-gray-600"
        />
        <input
          type="number" 
          v-model="borderRadius" 
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
  import { Style, BorderDirections, BorderInterface, BorderStyle, Border } from '@/models/styles/styles';
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
    shadowIconList = shadowIconList;
    lineStyleIconList = lineStyleIconList;
    borderEdgeIconList  = borderEdgeIconList;
    borderRadius = 0;
    borderDefinition:Border = Border.getInstance();
    borderUnits =['em', 'px', '%']

    @Emit('onBorderChange')
    setBorder() {
      return
    }
    
    borderEdgeChange(iconElement: IconPickerInterface) {
      const edge: BorderDirections = iconElement.class as BorderDirections;
      this.borderDefinition.borderDirection = edge;
      this.setBorder();
    }

    borderThicknessChange(amount: number) {
      if (this.borderDefinition.width.value  === 1 && amount === -1) {
        amount = -0.5;
      }
      this.borderDefinition.width.value =  this.borderDefinition.width.value + amount < 0 
        ? 0 
        : this.borderDefinition.width.value + amount;
      this.setBorder();
    }

    setLineStyle(iconElement: IconPickerInterface) {
      const lineStyle: BorderStyle = iconElement.class as BorderStyle;
      this.borderDefinition.style = lineStyle;
      if (lineStyle === 'double') this.borderDefinition.width.value= 3;
      this.setBorder();
    }

    @Emit('onShadowChange')
    onShadowChange(iconElement: IconPickerInterface) {
      return iconElement.class;
    }

    onUnitsChange(borderUnits: BoxUnits) {
      this.borderDefinition.borderRadius.units = borderUnits;
      this.setBorder();
    }
    
    onBorderRadiusChange() {
      this.borderDefinition.borderRadius.value = this.borderRadius;
      this.setBorder();
    }

  }
  </script>

  <style lang="postcss" scoped>


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