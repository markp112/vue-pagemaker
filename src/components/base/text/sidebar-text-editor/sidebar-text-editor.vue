<template>
  <section class="mt-2">
    <div class="sidebar-button-panel">
      <font-select @onChange="onItemChange"></font-select>
      <icon-select
        :buttonIconClassList="fontWeightButton"
        @selectChange="onItemChange"
      >
      </icon-select>
      <icon-toggle-button :thisIconButton="italicButton" @onChange="onItemChange" ></icon-toggle-button>
      <icon-toggle-button :thisIconButton="underLineButton" @onChange="onItemChange" ></icon-toggle-button>
      <div class="sidebar-button-container text-input">
        <span class="font-bold inline-block mr-2">Text</span>
        <input
          type="text"
          name="text"
          v-model="$props.textValue"
          @change="textChange()"
          class="app-input-field w-6/12 bg-siteSurface text-onSurface"
          placeholder="Enter content"
        />
        <drop-down 
          class="ml-1"
          :thisIconButton="fontSizeButton"
          @onSelectChange="onItemChange"
        >
        px
        </drop-down>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit } from 'vue-property-decorator';
import IconSelect from '@/components/base/pickers/icon-select/icon-select.vue';
import FontSelect from '@/components/base/pickers/font-selector/font-selector.vue';
import DropDown from '@/components/base/pickers/drop-down/drop-down.vue';
import IconToggleButton from '@/components/base/buttons/icon-toggle-button/icon-toggle-button.vue';
import {
  IconPickerInterface,
  fontWeightIconList 
} from '@/models/components/icon-picker-models';
import { ButtonIconClassList } from '@/models/styles/builders/button-icon-class-list';
import { ButtonIconClassInterface } from '@/models/styles/button-icon/button-icon';
import { ButtonIconNumeric } from '@/models/styles/button-icon/button-numeric-list/button-numeric-list';
import { ButtonFactory } from '@/models/styles/button-factory/button-factory';
import { Style } from '@/models/styles/styles';
import { SidebarButtonEventManager } from '../../../../classes/sidebarButtonEventManager/sidebarButtonEventManager';
import { StyleElement } from '@/classes/text-attributes/text-attributes';

@Component({
  props: {
    textValue: {
      default: '',
    },
  },
  components: {
    'icon-select': IconSelect,
    'font-select': FontSelect,
    'icon-toggle-button': IconToggleButton,
    'drop-down': DropDown,
  },
})
export default class SideBarTextEditor extends Vue {
  isFontItalic = false;
  isFontUnderlined = false;
  fontWeightIconList = fontWeightIconList;
  textContent = '';
  fontWeightButton: ButtonIconClassList = new ButtonFactory().createButton('class-list', 'font-weight') as ButtonIconClassList;
  italicButton: ButtonIconClassInterface = new ButtonFactory().createButton('class','italic-button') as ButtonIconClassInterface;
  underLineButton: ButtonIconClassInterface = new ButtonFactory().createButton('class','underline-button') as ButtonIconClassInterface;
  fontSizeButton: ButtonIconNumeric = new ButtonFactory().createButton('numeric','font-size') as ButtonIconNumeric;

  onItemChange(style: StyleElement) {
    const eventManager = SidebarButtonEventManager.getInstance();
    eventManager.applyValue('text', style);
    eventManager.updateEditedComponent();
  }

  @Emit('onTextChange')
  textChange(): string {
    return this.$props.textValue;
  }
}
</script>

<style lang="postcss" scoped>
  .text-input {
   @apply text-sm;
   @apply items-center;
  }

  @screen lg {
    .text-input {
      @apply flex-wrap;
      @apply justify-start;
    }
    
    .text-input span {
      @apply inline-block;
      @apply mb-2;
    }

  .text-input input {
      @apply self-center;
      
    }

  }

  @screen xl {
    .text-input {
      @apply flex-no-wrap;
      @apply justify-start;
    }
     .text-input span {
      @apply mb-0;
      @apply mr-1;
    }
    
  }
</style>