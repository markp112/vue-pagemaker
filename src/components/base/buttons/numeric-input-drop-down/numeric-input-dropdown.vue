<template>
  <div class="flex flex-row items-center justify-between">
    <img :src="getPath($props.thisIconButton.iconImage)"
      class="text-accent-600 cursor-pointer hover:bg-gray-600"
    />
    <input
      type="number" 
      v-model="inputValue" 
      size="2" 
      class="w-10 app-input-field text-sm mb-1 ml-1 mr-1 text-right" 
      @change="onInputChange()" />
    <drop-down
      :thisIconButton="$props.thisIconButton"
      @onSelectChange="onDropdownChange"
    >
    </drop-down>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component';
  import DropDown  from '@/components/base/pickers/drop-down/drop-down.vue';
  import { Emit } from 'vue-property-decorator';
  import { ButtonIconNumeric } from '@/models/styles/button-icon/button-numeric-list/button-numeric-list';
  import { ButtonIconNumericBuilder } from '@/models//styles/builders/button-icon-numeric'
  import { Style } from '@/models/styles/styles';
import { StyleElement } from '../../../../classes/text-attributes/text-attributes';

  @Component({
    components: {
      'drop-down': DropDown,
    },
    props: {
      thisIconButton: {
        default: (): ButtonIconNumeric => {
          return new ButtonIconNumericBuilder().build();
          },
        },
    },
  })
  export default class NumericInputDropdown extends Vue {
    name = 'NumericInputDroDown';
    inputValue = 0;

    mounted() {
      
      console.log('%c⧭', 'color: #aa00ff', this.$props.thisIconButton)
    }

    @Emit('onChange') 
    onChange() {
      const style: StyleElement = {
        styleName: this.$props.thisIconButton.style.style,
        value: this.inputValue.toString(),
        units: this.$props.thisIconButton.units,
      }
      return style;
    }

    onDropdownChange(styleOutput: StyleElement) {
      this.$props.thisIconButton.units = styleOutput.units;
      this.onChange();
    }

    onInputChange() {
      this.onChange();
    }

    getPath(image: string): string {
      const path = require.context('@/assets/icons',false,/\.png$/);
      return path(`./${image}`);
    }
  }
  
  </script>
