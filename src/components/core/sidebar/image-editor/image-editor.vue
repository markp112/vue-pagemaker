<template>
  <div class="sidebar-panel">
    <span class=" flex flex-row justify-end mr-2 mb-4">
      <close-button @onClick="closeButtonClick"></close-button>
    </span>
    <upload-image :urlEdited="currentImageUrl" @image-url="urlChanged" ></upload-image>
    <div class="mt-8 h-full p-1">
      <colour-select></colour-select>
      <border-buttons
        class="mt-2"
      >
      </border-buttons>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import CloseButton from '@/components/base/buttons/close-button/close-button.vue';
import UploadImage from '@/components/base/pickers/upload-image/upload-image.vue';
import BorderButtons from '@/components/base/buttons/borders/borders.vue';
import { PageModule } from '@/store/page/page';
import { SidebarModule } from '@/store//sidebar/sidebar';
import ColourSelect from '@/components/base/pickers/colour-picker/colour-select.vue';
import { Image } from '@/models/components/components';
import { PageElement } from '@/classes/page-element/PageElement';
import { ImageElement } from '@/classes/page-element/page-components/image-element/ImageElement';

@Component({
  components: {
    'upload-image': UploadImage,
    'border-buttons': BorderButtons,
    'close-button': CloseButton,
    'colour-select': ColourSelect,
  },
})
export default class ImageEditorSidebar extends Vue {
  name = 'ImageEditorSidebar';
  currentImageUrl = '';

  mounted() {
      const editedComponentData: ImageElement = (PageModule.editedComponentRef as ImageElement)
      if (editedComponentData) {
        this.currentImageUrl = editedComponentData.content;
      }
  }

  urlChanged(image: Image) {
    PageModule.updateComponentImage(image);
  }

  closeButtonClick(): void {
    SidebarModule.closeEditor();
  }

}
</script>
