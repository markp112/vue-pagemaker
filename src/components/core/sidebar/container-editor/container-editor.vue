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
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import CloseButton from '@/components/base/buttons/close-button/close-button.vue';
import UploadImage from '@/components/base/pickers/upload-image/upload-image.vue';
import JustificationButtons from '@/components/base/buttons/alignment/justification.vue';

@Component({
  components: {
    'upload-image': UploadImage,
    'close-button': CloseButton,
    'justification-buttons': JustificationButtons,
  }
})
export default class ContainerEditorSidebar extends Vue {

  urlChanged(url: string ) {
    this.$store.dispatch('updateComponentImage', url);
  }

  closeButtonClick(): void {
    this.$store.dispatch("closeEditor");
  }

  alignStartClick(): void {
    const classDef = 'flex flex-row justify-start';
    this.$store.dispatch('updateComponentClassProperties', classDef);
  }

  alignEvenlyClick(): void {
    const classDef = 'flex flex-row justify-around';
    this.$store.dispatch('updateComponentClassProperties', classDef);
  }

  alignCenterClick(): void {
    const classDef = 'flex flex-row justify-center';
    this.$store.dispatch('updateComponentClassProperties', classDef);
  }

  alignBetweenClick(): void {
    const classDef = 'flex flex-row justify-between';
    this.$store.dispatch('updateComponentClassProperties', classDef);
  }

  alignEndClick(): void {
    const classDef = 'flex flex-row justify-end';
    this.$store.dispatch('updateComponentClassProperties', classDef);
  }
}
</script>
