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
  import { ButtonIconNumeric, ButtonIconNumericBuilder  } from '@/models/styles/button-icon/button-numeric-list/button-numeric-list';

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

    @Emit('dropdownChange')
    onDropdownChange(value: string): string {
      return value;
    }

    @Emit('inputChange')
    onInputChange() {
      return this.inputValue;
    }

    getPath(image: string): string {
      const path = require.context('@/assets/icons',false,/\.png$/);
      return path(`./${image}`);
    }
  }
  
  </script>
