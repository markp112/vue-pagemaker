<template>
  <div>
    <p>Text Styles</p>
    <div class="sidebar-button-panel w-full">
      <font-select @onFontClick="onFontClick" onChange="onItalicClick"></font-select>
      <icon-select
        :buttonIconClassList="fontWeightButton"
        @selectChange="fontWeightChange"
      >
      </icon-select>
      <icon-toggle-button :thisIconButton="italicButton" @onChange="onItalicClick" ></icon-toggle-button>
      <icon-toggle-button :thisIconButton="underLineButton" @onChange="onUnderlinedClick" ></icon-toggle-button>
    </div>
    <div class="sidebar-button-panel w-full mt-2 items-center">
      <span class="text-sm font-bold">Text</span>
      <input
        type="text"
        name="text"
        v-model="textContent"
        @change="textChange"
        class="text-sm w-32 app-input-field mb-2"
        placeholder="Enter content"
      />
      <drop-down 
        class="ml-1"
        :thisIconButton="fontSizeButton"
        @onSelectChange="onFontSizeChange"
      >
      px
      </drop-down>
    </div>
  </div>
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
import { ButtonIconClassList } from '@/models/styles/button-icon/button-icon-class-list/button-icon-class-list';
import {  ButtonIconClassInterface, ButtonIconClassBuilder } from '@/models/styles/button-icon/button-icon';
import { ButtonIconNumeric } from '@/models/styles/button-icon/button-numeric-list/button-numeric-list';
import { ButtonFactory } from '@/models/styles/button-factory/button-factory';

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
  italicButton: ButtonIconClassInterface = new ButtonIconClassBuilder()
    .withClassName('italic')
    .withIconImage('font_italic-32.png')
    .withToolTip('italic')
    .withComponentName('icon-toggle-button')
    .withIconIsTypeOf('class')
    .build();
  underLineButton: ButtonIconClassInterface = new ButtonIconClassBuilder()
    .withClassName('underline')
    .withIconImage('font_underlined-32.png')
    .withToolTip('underline')
    .withComponentName('icon-toggle-button')
    .withIconIsTypeOf('class')
    .build();
  fontSizeButton: ButtonIconNumeric = new ButtonFactory().createButton('numeric','font-size') as ButtonIconNumeric;

  mounted() {
    this.textContent = this.$props.textValue;
  }

  @Emit('onFontWeightChange')
  fontWeightChange(iconElement: ButtonIconClassInterface): ButtonIconClassInterface {
    return iconElement;
  }

  @Emit('onItalicClick')
  onItalicClick(className: string) {
    this.isFontItalic = !this.isFontItalic;
    if(this.isFontItalic) {
      return 'italic';
    } 
    return 'not-italic';
  }

  @Emit('onUnderlineClick')
  onUnderlinedClick() {
    this.isFontUnderlined = !this.isFontUnderlined;
    if(this.isFontUnderlined) {
      return 'underline';
    } 
    return 'no-underline';
  }

  @Emit('onFontClick')
  onFontClick(fontName: string): string {
    return fontName;
  }

  @Emit('onFontSizeChange') 
  onFontSizeChange(fontSize: number): number {
    return fontSize;
  }

  @Emit('onTextChange')
  textChange(): string {
    return this.textContent;
  }
}
</script>
