<template>
  <div class="mt-8 p-0">
    <span class="inline-block flex flex-row justify-end mr-2 mb-4">
      <close-button @onClick="closeButtonClick"></close-button>
    </span>
    <div class="mr-2 mt-4">
      <p>Set Colour</p>
      <p class="flex flex-row justify-evenly items-center w-10/12 mb-2">
        <span :class="{'text-teal-400': textBackgroundorBorder==='background-color'}">background</span>
        <input type="radio" name="bg-check" id="background" value="background" checked @click="onRadioChange('background')">
        <span :class="{'text-teal-400': textBackgroundorBorder==='color'}"> font</span>
        <input type="radio" name="bg-check" id="font" value="font" @click="onRadioChange('color')">
        <span :class="{'text-teal-400': textBackgroundorBorder==='border'}"> border</span>
        <input type="radio" name="bg-check" id="border" value="border" @click="onRadioChange('border')">
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
          @onTextChange="onTextChange"
          @onItalicClick="onItalicClick"
          @onUnderlineClick="onUnderlineClick"
          @onFontClick="onFontClick"
        >
          </sidebar-text-editor>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import CloseButton from '@/components/base/buttons/close-button/close-button.vue';
import ColourPicker from '@/components//base/pickers/colour-picker/colour-picker.vue';
import ToggleSwitch from '@/components/base/buttons/switch/switch.vue';
import BorderButtons from '@/components/base/buttons/borders/borders.vue';
import SideBarTextEditor from '@/components/base/text/sidebar-text-editor/sidebar-text-editor.vue'
import { PageModule } from '@/store/page/page';
import { SidebarModule } from '@/store//sidebar/sidebar';
import { Style, BorderInterface, Border, BorderBuilder } from '@/models/styles/styles';
import { StyleTypes } from '../../../../models/page/page';
import { Page } from '../../../../models/pages/pages';

type BackgroundForeGround = 'background-color' | 'color' | 'border';

@Component({
  components: {
    'close-button': CloseButton,
    'colour-picker': ColourPicker,
    'toggle-switch': ToggleSwitch,
    'border-buttons': BorderButtons,
    'sidebar-text-editor': SideBarTextEditor,
  },
})
export default class ContainerEditorSidebar extends Vue {
  
  textBackgroundorBorder: BackgroundForeGround = 'background-color';
  isFontSelected = false;
  borderStyle: Style | null = null;
  borderColour = 'rgba(0, 0, 0, 1)';
  borderDefintion: BorderInterface | null = null;

  closeButtonClick(): void {
    SidebarModule.closeEditor();
  }

  onRadioChange(value: BackgroundForeGround) {
    this.textBackgroundorBorder = value;
  }

  onColourChange(rgbColour: string) {
    if(this.textBackgroundorBorder !== 'border'){
      const style: Style = { style: this.textBackgroundorBorder, value: rgbColour };
      PageModule.updateEditedComponentStyles(style);
    } else {
      this.borderColour = rgbColour;
      if(this.borderDefintion){
        this.setBorderStyle(this.buildBorder(this.borderDefintion));
      }
    }
  }

  buildBorder(borderStyle: BorderInterface): Border {
    this.borderDefintion = borderStyle;
    return new BorderBuilder()
      .setStyle(borderStyle.style)
      .setBorderDirection(borderStyle.borderDirection)
      .setWidth(borderStyle.width)
      .setBorderRadius(borderStyle.borderRadius)
      .setColour(this.borderColour)
      .build();
  }

  setBorderStyle(border:Border): void {
    PageModule.updateEditedComponentStyles(border.getBorderStyle());
    PageModule.updateEditedComponentStyles(border.getBorderRadius());
  }

  onBorderChange(borderStyle: BorderInterface): void {
    const border: Border = this.buildBorder(borderStyle);
    this.setBorderStyle(border); 
  }

  onRemoveStyle(styleToRemove: StyleTypes): void {
    PageModule.deleteEditedComponentStyle(styleToRemove);
  } 

  onShadowChange(classDef: string): void {
    PageModule.updateComponentClassProperties(classDef);
  }

  onFontWeightChange(classDef: string): void {
    PageModule.updateComponentClassProperties(classDef);
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
    PageModule.updateEditedComponentStyles({ style: 'font-family', value: fontName });
  }
}
</script>
