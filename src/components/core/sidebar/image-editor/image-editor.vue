<template>
  <div class="mt-8 p-0">
    <span class="inline-block flex flex-row justify-end mr-2 mb-4">
      <close-button @onClick="closeButtonClick"></close-button>
    </span>
    <upload-image @image-url="urlChanged" ></upload-image>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import CloseButton from '@/components/base/buttons/close-button/close-button.vue';
import UploadImage from '@/components/base/pickers/upload-image/upload-image.vue';
import { PageModule } from '@/store/page/page';
import { SidebarModule } from '@/store//sidebar/sidebar';

@Component({
  components: {
    'upload-image': UploadImage,
    'close-button': CloseButton,
  }
})
export default class ImageEditorSidebar extends Vue {

  urlChanged(url: string ) {
    PageModule.updateComponentImage(url);
  }

  closeButtonClick(): void {
    SidebarModule.closeEditor();
  }

}
</script>

