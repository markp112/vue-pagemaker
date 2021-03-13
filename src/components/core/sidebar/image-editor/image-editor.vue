<template>
  <div class="sidebar-panel">
    <span class="flex flex-row justify-end mr-2 mb-4">
      <close-button @onClick="closeButtonClick"></close-button>
    </span>
    <sidebar-accordian accordianTitle="Image" class="mb-4">
      <upload-image :urlEdited="currentImageUrl" @image-url="urlChanged">
      </upload-image>
    </sidebar-accordian>
    <div class="mt-2 h-full">
      <sidebar-accordian accordianTitle="Colours" class="mb-4">
        <colour-select
          flexAlignment="vertical"
          :showLabels="true"
        ></colour-select>
      </sidebar-accordian>
      <sidebar-accordian accordianTitle="Borders" class="mb-4">
        <border-buttons class="mt-2"> </border-buttons>
      </sidebar-accordian> <sidebar-accordian accordianTitle="Sizing" class="mb-4">
        <image-sizing-toolbar
          class="mt-2"
          :theEditedImage="getImageComponent"
        >
        </image-sizing-toolbar>
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
import ImageSizingToolbar from '@/components/base/buttons/sizing/image-sizing/imageSizing.vue'
import Accordian from '@/components/base/accordian/sidebar-accordian/sidebar-accordian.vue';
import { PageModule } from '@/store/page/page';
import { SidebarModule } from '@/store//sidebar/sidebar';
import { Image } from '@/models/components/components';
import { ImageElement } from '@/classes/page-element/page-components/image-element/ImageElement';
import { PageElementBuilder } from '@/classes/page-element/page-element-builder/PageElementBuilder';


@Component({
  components: {
    'upload-image': UploadImage,
    'border-buttons': BorderButtons,
    'close-button': CloseButton,
    'colour-select': ColourSelect,
    'sidebar-accordian': Accordian,
    'image-sizing-toolbar': ImageSizingToolbar,
  }
})
export default class ImageEditorSidebar extends Vue {
  name = 'ImageEditorSidebar';
  currentImageUrl = '';
  theEditedImage: ImageElement = new PageElementBuilder().buildAnImage();

  mounted() {
    this.theEditedImage = PageModule.getComponentRef as ImageElement;
    console.log('%c⧭', 'color: #e5de73', this.theEditedImage)
    if (this.theEditedImage) {
      this.currentImageUrl = this.theEditedImage.content;
    }
  }

  urlChanged(image: Image) {
    PageModule.updateComponentImage(image);
  }

  closeButtonClick(): void {
    SidebarModule.closeEditor();
  }

  get getImageComponent(): ImageElement {
    return PageModule.getComponentRef as ImageElement;
  }
}
</script>
