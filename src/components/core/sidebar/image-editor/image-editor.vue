<template>
  <div class="sidebar-panel">
    <span class=" flex flex-row justify-end mr-2 mb-4">
      <close-button @onClick="closeButtonClick"></close-button>
    </span>
     <sidebar-accordian accordianTitle="Image" class="mb-4">
      <upload-image
        :urlEdited="currentImageUrl"
        @image-url="urlChanged"
      >
      </upload-image>
     </sidebar-accordian>
    <div class="mt-2 h-full">
      <sidebar-accordian accordianTitle="Colours" class="mb-4">
        <colour-select flexAlignment="vertical" :showLabels="true"></colour-select>
      </sidebar-accordian>
      <sidebar-accordian accordianTitle="Borders" class="mb-4">
        <border-buttons
          class="mt-2"
        >
        </border-buttons>
      </sidebar-accordian>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import CloseButton from '@/components/base/buttons/close-button/close-button.vue';
import UploadImage from '@/components/base/pickers/upload-image/upload-image.vue';
import BorderButtons from '@/components/base/buttons/borders/borders.vue';
import ColourSelect from '@/components/base/pickers/colour-picker/colour-select.vue';
import Accordian from '@/components/base/accordian/sidebar-accordian/sidebar-accordian.vue';
import { PageModule } from '@/store/page/page';
import { SidebarModule } from '@/store//sidebar/sidebar';
import { Image } from '@/models/components/components';
import { PageElement } from '@/classes/page-element/PageElement';
import { ImageElement } from '@/classes/page-element/page-components/image-element/ImageElement';

@Component({
  components: {
    'upload-image': UploadImage,
    'border-buttons': BorderButtons,
    'close-button': CloseButton,
    'colour-select': ColourSelect,
    'sidebar-accordian': Accordian,
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
    console.log('%c⧭', 'color: #40fff2', image)
    PageModule.updateComponentImage(image);
  }

  closeButtonClick(): void {
    SidebarModule.closeEditor();
  }

}
</script>
