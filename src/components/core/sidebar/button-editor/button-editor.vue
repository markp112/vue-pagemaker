<template>
  <div class="sidebar-panel">
    <span class="flex flex-row justify-end mr-2 mb-4">
      <close-button @onClick="closeButtonClick"></close-button>
    </span>
    <div class="mr-2 mt-4 text-accent-600">
      <colour-select  @onColourChange="onColourChange"></colour-select>
      <border-buttons
        class="mt-2"
        @onBorderChange="onBorderChange"
        @onRemoveStyle="onRemoveStyle"
        @onShadowChange="onShadowChange"
      ></border-buttons>
      <sidebar-text-editor
        class="mt-2"
          :textValue="data"
        @onTextChange="onTextChange"
        @onFontWeightChange="onFontWeightChange"
        @onItalicClick="onItalicClick"
        @onUnderlineClick="onUnderlineClick"
        @onFontClick="onFontClick"
        @onFontSizeChange="onFontSizeChange"
        @onColourChange="onFontColourChange"
      >
      </sidebar-text-editor>
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
import ColourDropdown from '@/components/base/pickers/colour-picker/colour-dropdown.vue';
import ColourSelect from '@/components/base/pickers/colour-picker/colour-select.vue';
import ToggleSwitch from '@/components/base/buttons/switch/switch.vue';
import BorderButtons from '@/components/base/buttons/borders/borders.vue';
import SideBarTextEditor from '@/components/base/text/sidebar-text-editor/sidebar-text-editor.vue';
import ActionsSelect from '@/components/base/pickers/actions-select/actions-select.vue';
import { PageModule } from '@/store/page/page';
import { SidebarModule } from '@/store//sidebar/sidebar';
import { Colour } from '@/classes/colour/singleton-colour';
import { Style } from '@/models/styles/styles';
import { Border } from '@/classes/borders/borders';
import { ActionEvent } from '../../../../models/components/base-component';
import { IconPickerInterface } from '../../../../models/components/icon-picker-models';
import  { BorderButtonsMixin } from '@/mixins/sidebar-Editors/border-buttons/border-buttons-mixin';
import { ButtonIconClassInterface } from '@/models/styles/button-icon/button-icon';
import { SidebarButtonEventManager } from '../../../../classes/sidebarButtonEventManager/sidebarButtonEventManager';

type BackgroundForeGround = 'background-color' | 'color' | 'border';

@Component({
  components: {
    'close-button': CloseButton,
    'colour-select': ColourSelect,
    'toggle-switch': ToggleSwitch,
    'border-buttons': BorderButtons,
    'sidebar-text-editor': SideBarTextEditor,
    'actions-select': ActionsSelect,
  },
})
export default class ButtonEditor extends mixins(BorderButtonsMixin) {
  name = 'button-editor'
  textBackgroundorBorder: BackgroundForeGround = 'background-color';
  isFontSelected = false;
  data = PageModule.editComponentData;
  colour: Colour = Colour.getInstance();

  closeButtonClick(): void {
    SidebarModule.closeEditor();
  }

  onRadioChange(value: BackgroundForeGround) {
    this.textBackgroundorBorder = value;
  }

  onFontColourChange(rgbColour: string) {
    const style: Style = {
        style: 'color',
        value: rgbColour,
      };
      PageModule.updateEditedComponentStyles(style);
  }

  onColourChange(rgbColour: string) {
    if (this.colour.backgroundBorderForeground !=='border') {
      const style: Style = {
        style: this.colour.backgroundBorderForeground,
        value: rgbColour,
      };
      PageModule.updateEditedComponentStyles(style);
    } else {
        this.borderDefintion = Border.getInstance();
        this.borderDefintion.colour = rgbColour;
        this.setBorderStyle();
    }
  }

  onFontWeightChange(iconElement: ButtonIconClassInterface): void {
    // PageModule.updateComponentClassProperties(iconElement.className);
    const eventManager: SidebarButtonEventManager = SidebarButtonEventManager.getInstance();
    eventManager.updateEditedComponent();
  }

  onTextChange(text: string): void {
    PageModule.updateEditedComponentData(text);
  }

  onItalicClick(classDef: string): void {
    const eventManager: SidebarButtonEventManager = SidebarButtonEventManager.getInstance();
    eventManager.updateEditedComponent();
   // PageModule.updateComponentClassProperties(classDef);
  }
  onUnderlineClick(classDef: string): void {
    const eventManager: SidebarButtonEventManager = SidebarButtonEventManager.getInstance();
    eventManager.updateEditedComponent();
    // PageModule.updateComponentClassProperties(classDef);
  }

  onFontClick(fontFamilyStyle: Style): void {
    const eventManager: SidebarButtonEventManager = SidebarButtonEventManager.getInstance();
    eventManager.updateEditedComponent();
    // PageModule.updateEditedComponentStyles(fontFamilyStyle);
  }

  onFontSizeChange(fontSize: Style): void {
    const eventManager: SidebarButtonEventManager = SidebarButtonEventManager.getInstance();
    eventManager.updateEditedComponent();
    // PageModule.updateEditedComponentStyles(fontSize);
  }

  onActionEvent(actionEvent: ActionEvent) {
    PageModule.updateEditedComponentActionEvent(actionEvent);
  }
}
</script>
