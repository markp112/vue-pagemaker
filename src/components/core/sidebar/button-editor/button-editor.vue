<template>
  <div class="mt-8 p-0 bg-secondary-800 h-full p-1">
    <span class="inline-block flex flex-row justify-end mr-2 mb-4">
      <close-button @onClick="closeButtonClick"></close-button>
    </span>
    <div class="mr-2 mt-4 text-accent-600">
      <p>Set Colour</p>
      <p class="flex flex-row justify-evenly items-center w-10/12 mb-2">
        <span
          :class="{
            'text-teal-400': textBackgroundorBorder === 'background',
          }"
        >
          background
        </span>
        <input
          type="radio"
          name="bg-check"
          id="background"
          value="background"
          checked
          @click="onRadioChange('background')"
        />
        <span
          :class="{
            'text-teal-400': textBackgroundorBorder === 'color',
          }"
        >
          font
        </span>
        <input
          type="radio"
          name="bg-check"
          id="font"
          value="font"
          @click="onRadioChange('color')"
        />
        <span
          :class="{
            'text-teal-400': textBackgroundorBorder === 'border',
          }"
        >
          border
        </span>
        <input
          type="radio"
          name="bg-check"
          id="border"
          value="border"
          @click="onRadioChange('border')"
        />
      </p>
      <colour-picker @colour="onColourChange"></colour-picker>
      <border-buttons
        class="mt-2"
        @onBorderChange="onBorderChange"
        @onRemoveStyle="onRemoveStyle"
        @onShadowChange="onShadowChange"
      ></border-buttons>
      <sidebar-text-editor
        class="mt-2"
        @onFontWeightChange="onFontWeightChange"
        @onItalicClick="onItalicClick"
        @onUnderlineClick="onUnderlineClick"
        @onFontClick="onFontClick"
        @onFontSizeChange="onFontSizeChange"
      >
      </sidebar-text-editor>
      <text-input
        class="mt-2" 
        :textValue="data"
        @onTextChange="onTextChange"
      >
      </text-input>
      <actions-select 
        onActionSelect="onActionSelect" 
        class="mt-2"
      >
      </actions-select>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import CloseButton from '@/components/base/buttons/close-button/close-button.vue';
import ColourPicker from '@/components/base/pickers/colour-picker/colour-picker.vue';
import ToggleSwitch from '@/components/base/buttons/switch/switch.vue';
import BorderButtons from '@/components/base/buttons/borders/borders.vue';
import SideBarTextEditor from '@/components/base/text/sidebar-text-editor/sidebar-text-editor.vue';
import TextInput from '@/components/base/text/text-input/text-input.vue';
import ActionsSelect from '@/components/base/pickers/actions-select/actions-select.vue';
import { PageModule } from '@/store/page/page';
import { SidebarModule } from '@/store//sidebar/sidebar';
import {
  Style,
} from '@/models/styles/styles';
import { ActionEvent } from '../../../../models/components/base-component';
import { IconPickerInterface } from '../../../../models/components/icon-picker-models';
import  { BorderButtonsMixin } from '@/mixins/sidebar-Editors/border-buttons/border-buttons-mixin';

type BackgroundForeGround = 'background-color' | 'color' | 'border';

@Component({
  components: {
    'close-button': CloseButton,
    'colour-picker': ColourPicker,
    'toggle-switch': ToggleSwitch,
    'border-buttons': BorderButtons,
    'sidebar-text-editor': SideBarTextEditor,
    'actions-select': ActionsSelect,
    'text-input': TextInput,
  },
})
export default class ButtonEditor extends mixins(BorderButtonsMixin) {
  name = 'button-editor'
  textBackgroundorBorder: BackgroundForeGround = 'background-color';
  isFontSelected = false;
  borderColour = 'rgba(0, 0, 0, 1)';
  data = PageModule.editComponentData;

  closeButtonClick(): void {
    SidebarModule.closeEditor();
  }

  onRadioChange(value: BackgroundForeGround) {
    this.textBackgroundorBorder = value;
  }

  onColourChange(rgbColour: string) {
    if (this.textBackgroundorBorder !== 'border') {
      const style: Style = {
        style: this.textBackgroundorBorder,
        value: rgbColour,
      };
      PageModule.updateEditedComponentStyles(style);
    } else {
      this.borderColour = rgbColour;
      if (this.borderDefintion) {
        this.setBorderStyle(this.buildBorder(this.borderDefintion));
      }
    }
  }

onFontWeightChange(iconElement: IconPickerInterface): void {
    PageModule.updateComponentClassProperties(iconElement.class);
  }

  onTextChange(text: string): void {
    PageModule.updateEditedComponentData(text);
  }

  onItalicClick(classDef: string): void {
    PageModule.updateComponentClassProperties(classDef);
  }
  onUnderlineClick(classDef: string): void {
    PageModule.updateComponentClassProperties(classDef);
  }

  onFontClick(fontName: string): void {
    PageModule.updateEditedComponentStyles({
      style: 'font-family',
      value: fontName,
    });
  }

  onFontSizeChange(fontSize: number): void {
    PageModule.updateEditedComponentStyles({
      style: 'font-size',
      value: `${fontSize}px`,
    });
  }

  onActionEvent(actionEvent: ActionEvent) {
    PageModule.updateEditedComponentActionEvent(actionEvent);
  }
}
</script>
