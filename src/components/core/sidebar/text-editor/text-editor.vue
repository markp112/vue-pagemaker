<template>
  <div class="mt-8 p-0">
    <span class="flex flex-row justify-end mr-2 mb-4">
      <close-button @onClick="closeButtonClick"></close-button>
    </span>
    <div class="mr-2 mt-4">
      <align-buttons 
        @alignLeftClick="alignLeftClick"
        @alignCenterClick="alignCenterClick"
        @alignRightClick="alignRightClick"
      >
      </align-buttons>
      <widths-buttons @setWidthClick="setWidthClick"></widths-buttons>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import CloseButton from '@/components/base/buttons/close-button/close-button.vue';
import UploadImage from '@/components/base/pickers/upload-image/upload-image.vue';
import AlignmentButtons from '@/components/base/buttons/alignment/alignment.vue';
import WidthsButtons from '@/components/base/buttons/widths/widths.vue';
import { PageModule } from '@/store/page/page';
import { SidebarModule } from '@/store//sidebar/sidebar';

@Component({
  components: {
    'upload-image': UploadImage,
    'close-button': CloseButton,
    'align-buttons': AlignmentButtons,
    'widths-buttons': WidthsButtons,
  }
})
export default class TextEditorSidebar extends Vue {

  urlChanged(url: string ) {
    // PageModule.updateComponentImage(url);
  }

  closeButtonClick(): void {
    SidebarModule.closeEditor();
  }

  alignRightClick(): void {
    const classDef = 'flex flex-row justify-end';
    this.updateParentClassProperties(classDef);
  }

  alignLeftClick(): void {
    const classDef = 'flex flex-row justify-start';
    this.updateParentClassProperties(classDef);
  }

  alignCenterClick(): void {
    const classDef = 'flex flex-row justify-center';
    this.updateParentClassProperties(classDef);
  }
  
  setWidthClick(width: number) {
    interface Widths {
      [key: string]: string;
    }
    const widths: Widths = {
      '20': 'w-2/12',
      '40': 'w-4/12',
      '50': 'w-6/12',
      '60': 'w-8/12',
      '80': 'w-10/12',
      '100': 'w-full',
    }
    const classDef = widths[width.toString()];
    PageModule.updateComponentClassProperties(classDef);
  }

  private updateParentClassProperties(classDef: string) {
    PageModule.updateParentClassProperties(classDef);
  }
}
</script>

