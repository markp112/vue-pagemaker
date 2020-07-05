<template>
  <section>
      <p>Border Styles</p>
    <div class="sidebar-button-panel h-12 items-start text-accent-600 p-1">
      <icon-select :buttonIconClassList="borderDirectionButton" @selectChange="borderEdgeChange"></icon-select>
      <icon-select :buttonIconClassList="borderStyleButton"  @selectChange="setLineStyle"></icon-select>
      <icon-select :buttonIconClassList="shadowButton" @selectChange="onShadowChange"></icon-select>
    </div>
    <div class="sidebar-button-panel h-12 justify-evenly mt-2">
      <plus-minus-icon
        :thisIconButton="buttonIconDimension"
        @onChange="borderThicknessChange"
      >
      </plus-minus-icon>

      <numeric-input-dropdown 
        :thisIconButton="borderRadiusButton"
        @inputChange="onBorderRadiusChange"
        @dropdownChange="onUnitsChange"
        ></numeric-input-dropdown>
    </div>
  </section>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import { Emit } from 'vue-property-decorator';
  import { Style, BorderDirections, BorderInterface, BorderStyle } from '@/models/styles/styles';
  import { Border } from '@/classes/borders/borders';
  import IconSelect  from  '@/components/base/pickers/icon-select/icon-select.vue';
  import DropDown  from '@/components/base/pickers/drop-down/drop-down.vue';
  import PlusMinusIcon from '@/components/base/buttons/plus-minus-icon/plus-minus-icon.vue'
  import NumericInputDropdown from '@/components/base/buttons/numeric-input-drop-down/numeric-input-dropdown.vue'
  import {
    IconPickerInterface,
    shadowIconList,
    lineStyleIconList,
    borderEdgeIconList } from '@/models/components/icon-picker-models';
import { BoxUnits } from '../../../../models/components/box-dimension';
import { ButtonIconDimension } from '@/models/styles/builders/buttonIconDimension';
import { ButtonIconClassList } from '@/models/styles/builders/button-icon-class-list';
import { ButtonIconClassInterface } from '@/models/styles/button-icon/button-icon';
import { ButtonIconNumeric } from '../../../../models/styles/button-icon/button-numeric-list/button-numeric-list';
import { ButtonFactory } from '@/models/styles/button-factory/button-factory';

  @Component({
    components: {
      'icon-select': IconSelect,
      'drop-down': DropDown,
      'plus-minus-icon': PlusMinusIcon,
      'numeric-input-dropdown': NumericInputDropdown,
      
    },
  })
  export default class BorderButtons extends Vue {
    name = 'border-buttons';
    shadowIconList = shadowIconList;
    lineStyleIconList = lineStyleIconList;
    borderEdgeIconList  = borderEdgeIconList;
    borderRadius = 0;
    borderDefinition: Border = Border.getInstance();
    borderUnits = ['em', 'px', '%']
    buttonIconDimension: ButtonIconDimension = new ButtonFactory().createButton('dimension', 'border-thickness') as ButtonIconDimension;
    shadowButton: ButtonIconClassList = new ButtonFactory().createButton('class-list', 'Shadow') as ButtonIconClassList;
    borderDirectionButton: ButtonIconClassList = new ButtonFactory().createButton('class-list', 'border-direction') as ButtonIconClassList;
    borderStyleButton: ButtonIconClassList = new ButtonFactory().createButton('class-list', 'border-styles') as ButtonIconClassList;
    borderRadiusButton: ButtonIconNumeric = new ButtonFactory().createButton('numeric','border-radius') as ButtonIconNumeric;

    @Emit('onBorderChange')
    setBorder() {
      return;
    }
    
    borderEdgeChange(iconElement: ButtonIconClassInterface) {
      const edge: BorderDirections = iconElement.className as BorderDirections;
      this.borderDefinition.borderDirection = edge;
      this.setBorder();
    }

    borderThicknessChange() {
      this.setBorder();
    }

    setLineStyle(iconElement: ButtonIconClassInterface) {
      const lineStyle: BorderStyle = iconElement.className as BorderStyle;
      this.borderDefinition.style = lineStyle;
      this.setBorder();
    }

    @Emit('onShadowChange')
    onShadowChange(iconElement: ButtonIconClassInterface) {
      return iconElement.className;
    }

    onUnitsChange(borderUnits: string) {
      this.borderDefinition.borderRadius.units = borderUnits as BoxUnits;
      this.setBorder();
    }
    
    onBorderRadiusChange(value: number) {
      this.borderDefinition.borderRadius.value = value;
      this.setBorder();
    }

  }
  </script>

  <style lang="postcss" scoped>


  .bg-secondary-hidden {
    background-image: url("../../../../assets/icons/hidden-32.png");
  } 
  </style>