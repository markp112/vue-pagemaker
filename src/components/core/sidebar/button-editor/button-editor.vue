<template>
  <div class="mt-8 p-0">
    <span class="inline-block flex flex-row justify-end mr-2 mb-4">
      <close-button @onClick="closeButtonClick"></close-button>
    </span>
    <div class="mr-2 mt-4">
      <p>Set Colour</p>
      <p class="flex flex-row justify-evenly items-center w-10/12">
        <span :class="{'text-teal-400': !isFontSelected}">background</span>
        <toggle-switch class="mb-2" @onToggle="onToggle"></toggle-switch>
        <span :class="{'text-teal-400': isFontSelected}"> font</span>
      </p>
      <colour-picker @colour="onColourChange"></colour-picker>
      <border-buttons 
        class="mt-2"
        @onBorderChange="onBorderChange"
        ></border-buttons>
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
import { PageModule } from '@/store/page/page';
import { SidebarModule } from '@/store//sidebar/sidebar';
import { Style } from '@/models/page/page';

type BackgroundForeGround = 'background-color' | 'color';

@Component({
  components: {
    'close-button': CloseButton,
    'colour-picker': ColourPicker,
    'toggle-switch': ToggleSwitch,
    'border-buttons': BorderButtons,
  },
})
export default class ContainerEditorSidebar extends Vue {
  
  textOrBackground: BackgroundForeGround = 'background-color';
  isFontSelected = false;
  closeButtonClick(): void {
    SidebarModule.closeEditor();
  }

  onColourChange(rgbColour: string) {
    const style: Style = {style: this.textOrBackground, value: rgbColour};
    PageModule.updateEditedComponentStyles(style);
  }

  onToggle(switchIsOn: boolean) {
    this.isFontSelected = switchIsOn;
    this.textOrBackground = switchIsOn ? 'color' : 'background-color';
  }

  onBorderChange(style: Style) {
    PageModule.updateEditedComponentStyles(style);
  }
}
</script>
