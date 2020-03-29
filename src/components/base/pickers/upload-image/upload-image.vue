<template>
<div>
  <div class="flex flex-col justify-center align-middle w-full border bg-white h-full">
        <input
          class="w-full"
          type="file"
          @change="setImage( $event.target.name, $event.target.files)"
          accept="image/png, image/jpeg"
          />
    <div class="image-drop flex flex-col justify-start" 
      :class="{'is-dragging': isDragging}"
      @dragstart.prevent="dragOver()"
      @dragover.prevent="dragOver()"
      @dragleave.prevent="dragLeave()"
      @drop.prevent="drop($event)">
      <h3 v-if="!hasFile" class="z-10 fixed font-bold text-accent">Upload a file by dropping it here</h3>
      <img :src="getImage"  class="border object-contain w-full h-full" ref="imagePlaceholder"/>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import { Emit } from 'vue-property-decorator'
import FormButton from '@/components/base/buttons/form-button.vue';

@Component ({
  components:{
    'form-button': FormButton,
  }
})
export default class UploadImage extends Vue {

  url = '';
  isDragging!: boolean;
  wrongFile!: boolean;
  hasFile!: boolean;

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

  @Emit('image-url')
  drop(e: DragEvent) {
    if(e.dataTransfer !== null) {
      const files = e.dataTransfer.files
        this.wrongFile = false
        // allows only 1 file
        if (files.length === 1) {
          const file = files[0]
          return new Promise((resolve, reject) => {
            this.$store.dispatch('firestoreSaveFile',file)
            .then(result => {
              this.hasFile = true;
              this.url = result.message;
              resolve(result.message);
              })
            })
        }
      }
  }

  @Emit('image-url')
  setImage(targetName:string, file: File[]) {
    const url = file[0];
    return new Promise((resolve, reject) => {
      this.$store.dispatch('firestoreSaveFile', file[0])
      .then(result => {
        this.url = result.message;
        resolve(result.message);
      })
      .catch(err => reject(err))
    })
  }

  get getImage() {
    if(this.url === '') {
      return require('@/assets/images/imageplaceholder.png')
    } else { return this.url }
  }

  get getClasses(){
      return {isDragging: this.isDragging}
    }
}
</script>

<style lang="postcss">

.image-drop {
  width: 100%;
  height: 100%;
  background-color: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color .2s ease-in-out;
}

.is-dragging{
  @apply bg-accent1;
  
}
</style>