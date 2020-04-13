<template>
  <div class="mt-8 p-0">
    <span class="inline-block flex flex-row justify-end mr-2 mb-4">
      <close-button @onClick="closeButtonClick"></close-button>
    </span>
    <upload-image @image-url="urlChanged" ></upload-image>
    <div class="mr-2 mt-4">
      <align-buttons 
        @alignLeftClick="alignLeftClick"
        @alignCenterClick="alignCenterClick"
        @alignRightClick="alignRightClick"
      >
      </align-buttons>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import CloseButton from '@/components/base/buttons/close-button/close-button.vue';
import UploadImage from '@/components/base/pickers/upload-image/upload-image.vue';
import AlignmentButtons from '@/components/base/buttons/alignment/alignment.vue';

@Component({
  components: {
    'upload-image': UploadImage,
    'close-button': CloseButton,
    'align-buttons': AlignmentButtons,
  }
})
export default class ImageEditorSidebar extends Vue {

  urlChanged(url: string ) {
    this.$store.dispatch('updateComponentImage', url);
  }

  closeButtonClick(): void {
    this.$store.dispatch("closeEditor");
  }

  alignRightClick(): void {
    const classDef = 'flex flex-row justify-end';
    this.$store.dispatch('updateParentClassProperties', classDef);
  }

  alignLeftClick(): void {
    const classDef = 'flex flex-row justify-start';
    this.$store.dispatch('updateParentClassProperties', classDef);
  }

  alignCenterClick(): void {
    const classDef = 'flex flex-row justify-center';
    this.$store.dispatch('updateParentClassProperties', classDef);
  }
}
</script>
