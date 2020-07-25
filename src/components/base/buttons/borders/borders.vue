<template>
  <section>
      <p>Border Styles</p>
    <div class="sidebar-button-panel h-12 items-start text-accent-600 p-1">
      <icon-select :buttonIconClassList="borderDirectionButton" @selectChange="onItemChange($event, 'border')"></icon-select>
      <icon-select :buttonIconClassList="borderStyleButton"  @selectChange="onItemChange($event, 'border')"></icon-select>
      <icon-select :buttonIconClassList="shadowButton" @selectChange="onItemChange($event, 'shadow')"></icon-select>
    </div>
    <div class="sidebar-button-panel h-12 justify-evenly mt-2">
      <plus-minus-icon
        :thisIconButton="buttonIconDimension"
        @onChange="onItemChange($event, 'border')"
      >
      </plus-minus-icon>

      <numeric-input-dropdown 
        :thisIconButton="borderRadiusButton"
        @onChange="onItemChange($event, 'border') "
        >
      </numeric-input-dropdown>
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
import { StyleElement } from '../../../../classes/text-attributes/text-attributes';
import { SidebarButtonEventManager, ImpactedAttributeTypes } from '@/classes/sidebarButtonEventManager/sidebarButtonEventManager';

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
    borderRadiusButton: ButtonIconNumeric = new ButtonFactory().createButton('numeric', 'border-radius') as ButtonIconNumeric;

    @Emit('onBorderChange')
    setBorder() {
      return;
    }
    
    @Emit('onBorderChange')
    onItemChange( style: StyleElement, itemType: ImpactedAttributeTypes) {
      const eventManager = SidebarButtonEventManager.getInstance();
      eventManager.applyValue(itemType, style);
      return;
    }

    // @Emit('onBorderChange')
    // borderEdgeChange(style: StyleElement) {
    //   const eventManager = SidebarButtonEventManager.getInstance();
    //   eventManager.applyValue('border', style);
    //   return;
    // }

    // @Emit('onBorderChange')
    // borderThicknessChange(style: StyleElement) {
    //   const eventManager = SidebarButtonEventManager.getInstance();
    //   eventManager.applyValue('border', style);
    //   return;
    // }

    // setLineStyle(style: StyleElement) {
    //   const eventManager = SidebarButtonEventManager.getInstance();
    //   eventManager.applyValue('border', style);
    //   return;
    // }

    // @Emit('onShadowChange')
    // onShadowChange(style: StyleElement) {
    //   const eventManager = SidebarButtonEventManager.getInstance();
    //   eventManager.applyValue('shadow', style);
    //   return;
    // }

    // onUnitsChange(style: StyleElement) {
    //   const eventManager = SidebarButtonEventManager.getInstance();
    //   eventManager.applyValue('border', style);
    //   return;
    // }
    
    // onBorderRadiusChange(value: number) {
    //   this.borderDefinition.borderRadius.value = value;
    //   this.setBorder();
    // }

  }
  </script>

  <style lang="postcss" scoped>


  .bg-secondary-hidden {
    background-image: url("../../../../assets/icons/hidden-32.png");
  } 
  </style>