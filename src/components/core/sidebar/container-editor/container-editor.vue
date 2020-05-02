<template>
  <div class="mt-8 p-0">
    <span class="inline-block flex flex-row justify-end mr-2 mb-4">
      <close-button @onClick="closeButtonClick"></close-button>
    </span>
    <div class="mr-2 mt-4">
      <justification-buttons 
        @alignStartClick="alignStartClick"
        @alignCenterClick="alignCenterClick"
        @alignEvenlyClick="alignEvenlyClick"
        @alignBetweenClick="alignBetweenClick"
        @alignEndClick="alignEndClick"
      >
      </justification-buttons>
      <vertical-alignment class="mt-2"
        @alignTopClick="alignTopClick"
        @alignVerticalCenterClick="alignVerticalCenterClick"
        @alignBottomClick="alignBottomClick"
      >
      </vertical-alignment>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import CloseButton from '@/components/base/buttons/close-button/close-button.vue';
import UploadImage from '@/components/base/pickers/upload-image/upload-image.vue';
import JustificationButtons from '@/components/base/buttons/alignment/justification.vue';
import VerticalAlignmentButtons from '@/components/base/buttons/alignment/vertical-alignment.vue';
import { PageModule } from '@/store/page/page';
import { SidebarModule } from '@/store//sidebar/sidebar';

@Component({
  components: {
    'upload-image': UploadImage,
    'close-button': CloseButton,
    'justification-buttons': JustificationButtons,
    'vertical-alignment': VerticalAlignmentButtons,
  }
})
export default class ContainerEditorSidebar extends Vue {

  urlChanged(url: string ) {
    PageModule.updateComponentImage(url);
  }

  closeButtonClick(): void {
    SidebarModule.closeEditor();
  }

  alignStartClick(): void {
    const classDef = 'flex flex-row justify-start';
    this.updateTheComponentClassProperties(classDef);
  }

  alignEvenlyClick(): void {
    const classDef = 'flex flex-row justify-around';
    this.updateTheComponentClassProperties(classDef);
  }

  alignCenterClick(): void {
    const classDef = 'flex flex-row justify-center';
    this.updateTheComponentClassProperties(classDef);
  }

  alignBetweenClick(): void {
    const classDef = 'flex flex-row justify-between';
    this.updateTheComponentClassProperties(classDef);
  }

  alignEndClick(): void {
    const classDef = 'flex flex-row justify-end';
    this.updateTheComponentClassProperties(classDef);
  }

  alignTopClick(): void {
    const classDef = 'flex flex-row items-start';
    this.updateTheComponentClassProperties(classDef);
  }

  alignBottomClick(): void {
    const classDef = 'flex flex-row items-end';
    this.updateTheComponentClassProperties(classDef);
  }

  alignVerticalCenterClick(): void {
    const classDef = 'flex flex-row items-center';
    this.updateTheComponentClassProperties(classDef);
  }

  updateTheComponentClassProperties(classDef: string): void {
    PageModule.updateComponentClassProperties(classDef);
  }

}
</script>
