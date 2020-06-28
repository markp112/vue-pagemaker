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
  import PlusMinusIcon from '@/components/base/buttons/plus-minus-icon/plus-minus-icon.vue'
  import {
    IconPickerInterface,
    shadowIconList,
    lineStyleIconList,
    borderEdgeIconList } from '@/models/components/icon-picker-models';
import { BoxUnits } from '../../../../models/components/box-dimension';
import { ButtonIconDimensionBuilder, ButtonIconDimension } from '../../../../models/styles/button-icon/buttonIconDimension';
import { IconButtonBuilder } from '@/models/styles/button-icon/button-icon';
import { ButtonIconClassList } from '@/models/styles/button-icon/button-icon-class-list/button-icon-class-list';
import { ButtonIconBuilder, ButtonIconClassInterface } from '@/models/styles/button-icon/button-icon';

  @Component({
    components: {
      'icon-select': IconSelect,
      'drop-down': DropDown,
      'plus-minus-icon': PlusMinusIcon,
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
    buttonIconDimension: ButtonIconDimension = new IconButtonBuilder().buildDimension('thickness-32.png','border thickness');
    shadowButton: ButtonIconClassList = new ButtonIconBuilder().build('Shadow');
    borderDirectionButton: ButtonIconClassList = new ButtonIconBuilder().build('border-direction');
    borderStyleButton: ButtonIconClassList = new ButtonIconBuilder().build('border-styles');

    @Emit('onBorderChange')
    setBorder() {
      return;
    }
    
mounted() {
    console.log('%c⧭', 'color: #bfffc8', this.shadowButton)

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


  .bg-secondary-hidden {
    background-image: url("../../../../assets/icons/hidden-32.png");
  } 
  </style>