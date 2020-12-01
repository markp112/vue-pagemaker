<template>
  <div class="flex flex-col justify-center align-middle w-full text-sm">
    <input
      class="w-full app-input-field text-siteDark mb-1"
      type="file"
      @change="setImage( $event.target.name, $event.target.files)"
      accept="image/png, image/jpeg"
      />
    <input
        class="w-full app-input-field text-sm text-siteDark  mb-1"
        type="text"
        @input="getImageFromUrl"
        placeholder="or paste URL"
        name="url"
        v-model="url"
    />
    <div 
      class="image-drop flex flex-col justify-start" 
      :class="{'is-dragging': isDragging}"
      @dragstart.prevent="dragOver()"
      @dragover.prevent="dragOver()"
      @dragleave.prevent="dragLeave()"
      @drop.prevent="drop($event)">
      <h3 
        v-if="!hasFile" 
        class="z-10 fixed font-bold text-siteDark flex-row flex-wrap justify-start p-1 mb-1 block"
      >
        Upload a file by dropping it here
      </h3>
      <img
        :src="getImage"
        class="border object-contain h-32 mt-2"
        ref="imagePlaceholder"
        @load="onImageLoad()"
      />
    </div>
    <div class="flex flex-row justify-start w-full items-center h-8">
      <label for="maintain-ratio" class="w-6/12">Maintain Ratio</label>
      <input
        type="checkbox"
        class="w-2/12"
        @click="maintainClick"
        :checked="maintainRatio"
        id="maintain-ratio"/>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import { Emit } from 'vue-property-decorator';
import { ServicesModule } from '@/store/services/services';
import { Image, Dimensions } from '@/models/components/components';
import { Units } from '@/models/enums/units/units';

@Component ({
  props: {
    urlEdited: {
      default: ''
    },
  },
})
export default class UploadImage extends Vue {
  url = '';
  isDragging!: boolean;
  wrongFile!: boolean;
  hasFile = false;
  maintainRatio = true;

  mounted() {
    this.url = this.$props.urlEdited;
  }

  created() {
    this.isDragging = false;
    this.wrongFile = false;
    this.hasFile = false;
  }

  dragOver() {
    this.isDragging = true
  }

  dragLeave(){
    this.isDragging = false
  }

  onImageLoad() {
     this.updateImage();
  }

  maintainClick() {
    this.maintainRatio = !this.maintainRatio;
    this.updateImage();
  }
  
  drop(e: DragEvent) {
    if(e.dataTransfer !== null) {
      const files = e.dataTransfer.files
        this.wrongFile = false
        // allows only 1 file
        if (files.length === 1) {
          const file = files[0]
          return new Promise((resolve, reject) => {
            ServicesModule.firestoreSaveFile(file)
            .then(result => {
              this.hasFile = true;
              this.url = result.message;
              this.updateImage();
              resolve();
              })
            })
        }
      }
  }
  
  setImage(targetName:string, file: File[]) {
    const url = file[0];
    return new Promise((resolve, reject) => {
      ServicesModule.firestoreSaveFile(file[0])
        .then(result => {
          this.url = result.message;
          this.updateImage();
          resolve();
        })
        .catch(err => reject(err))
    })
  }

  
  getImageFromUrl() {
    this.hasFile = this.url !== '';
  }

  @Emit('image-url')
  updateImage(): Image {
    const img = this.$refs.imagePlaceholder as HTMLImageElement;
    const image = new Image();
    image.maintainRatio = this.maintainRatio;
    image.content = this.url;
    image.naturalSize.width = img.naturalWidth;
    image.naturalSize.height = img.naturalHeight;
    return image;
  }

  get getImage() {
      if (this.url === '') {
        this.url = this.$props.urlEdited;
        return this.url === '' ? require('@/assets/images/imageplaceholder-100x83.png') : this.url;
      } else { 
        return this.url 
      };
    }

  get getClasses(){
      return {isDragging: this.isDragging};
  }
}
</script>

<style lang="postcss">

.image-drop {
  width: 100%;
  @apply h-full;
  background-color: #eee;
  @apply flex;
  @apply flex-row;
  @apply justify-center;
  
}

.is-dragging{
  @apply bg-accent1;
  
}
</style>