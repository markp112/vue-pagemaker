<template>
  <section class="flex flex-col justify-start h-72 p-1 w-full rounded-sm bg-white shadow-lg border-2 border-gray-400">
    <p class="flex justify-end flex-row w-full">
      <close-button @onClick="closeClicked()">
      </close-button>
    </p>
    <div class="flex flex-row flex-nowrap w-full justify-between items-center h-full">
      <img 
        src="@/assets/icons/left-grey-32.png" 
        alt=""
        class="nav-arrow"
        @click="leftArrowClick()"
      >
      <span
        v-for="image in getImages"
        :key="image.url"
        class="w-44 h-auto border border-gray-200 inline-block ml-1 mr-1"
      >
        <img :src="image.url" alt="" @click="imageClicked(image.url)" class="cursor-pointer">
      </span>
      <img 
        src="@/assets/icons/right-grey-32.png" 
        alt=""
        class="nav-arrow"
        @click="rightArrowClick()"
      >
    </div>
  </section>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import CloseButton from '@/components/base/buttons/close-button/close-button.vue';
import { Emit } from 'vue-property-decorator';
import { BucketImagesMixin } from '@/mixins/bucket-images/bucket-images';
import { ImageCardProps } from '../../cards/image-card/models/image-card-models';

@Component({
  props: {
    parentImages: { default: (): ImageCardProps[] => {
      return [];
    }}
  },
  components: {
    'close-button': CloseButton,
  }
})
export default class ImagePicker extends BucketImagesMixin {
  name = 'image-picker';
  imagePointer = 0;
  maxImages = 0;

  created() {
    if (this.$props.parentImages.length !== 0) {
      this.images = this.$props.parentImages;
    } else {
      console.log("called")
      this.getImagesFromBucket();
    }
  }

  get getImages() {
    this.maxImages = this.images.length < 3 ? this.images.length : 3;
    const imageBuffer: ImageCardProps[] = [];
    for (let index = this.imagePointer; index < this.maxImages + this.imagePointer; index++) {
      imageBuffer.push(this.images[index]);
    }
    return imageBuffer;
  }

  @Emit('closeClicked')
  closeClicked() {
    return;
  }

  @Emit('imageClicked')
  imageClicked(url: string) {
    return url;
  }

  leftArrowClick() {
    this.imagePointer--;
    if (this.imagePointer < 0) this.imagePointer = this.images.length - this.maxImages;
  }
  
  rightArrowClick() {
    this.imagePointer++;
    if (this.imagePointer + this.maxImages > this.images.length) this.imagePointer = 0;
  }

}
</script>

<style lang="css">
  .nav-arrow {
    @apply cursor-pointer;
    @apply rounded-full;
  }

  .nav-arrow:hover {
    @apply bg-gray-400;
  }
</style>>
