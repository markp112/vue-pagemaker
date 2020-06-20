<template>
  <div class="mt-8 bg-secondary-800 h-full p-1">
    <span class="inline-block flex flex-row justify-end mr-2 mb-4">
      <close-button @onClick="closeButtonClick"></close-button>
    </span>
    <upload-image @image-url="urlChanged"></upload-image>
  <div class="mt-8 p-0 bg-secondary-800 h-full p-1">
    <border-buttons
        class="mt-2"
        @onBorderChange="onBorderChange"
        @onRemoveStyle="onRemoveStyle"
        @onShadowChange="onShadowChange"
      ></border-buttons>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import CloseButton from '@/components/base/buttons/close-button/close-button.vue';
import UploadImage from '@/components/base/pickers/upload-image/upload-image.vue';
import BorderButtons from '@/components/base/buttons/borders/borders.vue';
import { PageModule } from '@/store/page/page';
import { SidebarModule } from '@/store//sidebar/sidebar';

import { StyleTypes } from '../../../../models/page/page';
import  { BorderButtonsMixin } from '@/mixins/sidebar-Editors/border-buttons/border-buttons-mixin';

@Component({
  components: {
    'upload-image': UploadImage,
    'border-buttons': BorderButtons,
    'close-button': CloseButton,
  }
})
export default class ImageEditorSidebar extends mixins(BorderButtonsMixin) {
  name = 'ImageEditorSidebar';

  urlChanged(url: string ) {
    PageModule.updateComponentImage(url);
  }

  closeButtonClick(): void {
    SidebarModule.closeEditor();
  }

}
</script>

