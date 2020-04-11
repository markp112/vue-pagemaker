<template>
  <div>
    <upload-image @image-url="urlChanged"></upload-image>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import UploadImage from '@/components/base/pickers/upload-image/upload-image.vue'

@Component({
  components: {
    'upload-image': UploadImage,
  }
})
export default class ImageEditorSidebar extends Vue {
  
  urlChanged(url: string ) {
    console.log("Image", url)
  }

}
</script>