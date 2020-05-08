<template>
  <div>
    <div class="button-panel p-2">
      <img src="@/assets/icons/border_outside-32.png"
        class="text-accent cursor-pointer hover:bg-gray-600"
        :class="{'bg-secondary-100': selectedBorder === 'border'}"
        @click="borderEdgeChange('border')" />
      <img src="@/assets/icons/border_top-32.png"
        class="text-accent cursor-pointer hover:bg-gray-600"
        :class="{'bg-secondary-100': selectedBorder === 'top'}"
        @click="borderEdgeChange('top')" />
      <img src="@/assets/icons/border_bottom-32.png"
        class="text-accent cursor-pointer hover:bg-gray-600"
        :class="{'bg-secondary-100': selectedBorder === 'bottom'}"
        @click="borderEdgeChange('bottom')" />
      <img src="@/assets/icons/border_left-32.png"
        class="text-accent cursor-pointer hover:bg-gray-600"
        :class="{'bg-secondary-100': selectedBorder === 'left'}"
        @click="borderEdgeChange('left')" />
      <img src="@/assets/icons/border_right-32.png"
        class="text-accent cursor-pointer hover:bg-gray-600"
        :class="{'bg-secondary-100': selectedBorder === 'right'}"
        @click="borderEdgeChange('right')" />
      <img src="@/assets/icons/border_none-32.png"
        class="text-accent cursor-pointer hover:bg-gray-600"
        :class="{'bg-secondary-100': selectedBorder === 'none'}"
        @click="removeStyle('none')" />
      <img src="@/assets/icons/eye_open-32.png"
        v-if="border.style !== 'hidden'"
        class="text-accent cursor-pointer hover:bg-gray-600"
        :class="{'bg-secondary-hidden': border.style === 'hidden'}"
        @click="setLineStyle('hidden')" />
      <img src="@/assets/icons/hidden-32.png"
        v-if="border.style === 'hidden'"
        class="text-accent cursor-pointer hover:bg-gray-600"
        :class="{'bg-secondary-hidden': border.style === 'solid'}"
        @click="setLineStyle('solid')" />
    </div>
    <div class="button-panel mt-1 p-1">
      <img src="@/assets/icons/solid-line-32.png"
        class="text-accent cursor-pointer hover:bg-gray-600"
        :class="{'bg-secondary-100': border.style === 'solid'}"
        @click="setLineStyle('solid')" />
      <img src="@/assets/icons/dotted-line-32.png"
        class="text-accent cursor-pointer hover:bg-gray-600"
        :class="{'bg-secondary-100': border.style === 'dotted'}"
        @click="setLineStyle('dotted')" />
      <img src="@/assets/icons/dashed-line-32.png"
        class="text-accent cursor-pointer hover:bg-gray-600"
        :class="{'bg-secondary-100': border.style === 'dashed'}"
        @click="setLineStyle('dashed')" />
      <img src="@/assets/icons/double-line-32.png"
        class="text-accent cursor-pointer hover:bg-gray-600"
        :class="{'bg-secondary-100': border.style === 'double'}"
        @click="setLineStyle('double')" />
      <img src="@/assets/icons/inset-32.png"
        class="text-accent cursor-pointer hover:bg-gray-600"
        :class="{'bg-secondary-100': border.style === 'inset'}"
        @click="setLineStyle('inset')" />
      <img src="@/assets/icons/ridge-32.png"
        class="text-accent cursor-pointer hover:bg-gray-600"
        :class="{'bg-secondary-100': border.style === 'ridge'}"
        @click="setLineStyle('ridge')" />
      <img src="@/assets/icons/groove-32.png"
        class="text-accent cursor-pointer hover:bg-gray-600"
        :class="{'bg-secondary-100': border.style === 'groove'}"
        @click="setLineStyle('groove')" />
    </div>
    <div class="button-panel mt-1 p-1">
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
        <img src="@/assets/icons/shadows-32.png"
            class="text-accent cursor-pointer hover:bg-gray-600"
            :class="{'bg-secondary-100': isBorderRadiusSelected}"
            @click="onBorderRadiusChange" />
            <icon-select iconSelect="shadows-32.png" :iconList="iconList"></icon-select>
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
    iconList = [
      { icon: 'check_box-32.png', class: 'shadow-sm' },
      { icon: 'check_box-32.png', class: 'shadow-md' },
      { icon: 'check_box-32.png', class: 'shadow-lg' },
      { icon: 'check_box-32.png', class: 'shadow-xl' },
      { icon: 'check_box-32.png', class: 'shadow-2xl' },
      { icon: 'check_box-32.png', class: 'shadow-inner' },
      { icon: 'check_box-32.png', class: 'shadow-outline' },
    ]


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