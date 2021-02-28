<template>
  <div>
    <div class="flex flex-row justify-between w-full h-16">
      <p>Image Library</p>
      <dropdown-select></dropdown-select>
      <close-button></close-button>
    </div>
    <div class="flex flex-row flex-wrap w-full p-2">
      <image-card
        v-for="(image, index) in getImages"
        :image="image"
        :key="index"
        class="ml-2 mt-2"
      ></image-card>
      
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import ImageCard, { ImageCardProps } from '@/components/base/cards/image-card/image-card.vue';
import DropdownMultiSelect from '@/components/base/pickers/dropdown-multi-select/dropdown-multi-select.vue';
import CloseButton from '@/components/base/buttons/close-button/close-button.vue';
import Component from 'vue-class-component';
import { CloudStorageModule } from '@/store/services/storage';
import { BucketImage } from '@/store/services/models/bucket-image';

@Component({
  props: {
    sourceBucket: {default: '' },
  },
  components: {
    'image-card': ImageCard,
    'dropdown-select': DropdownMultiSelect,
    'close-button': CloseButton,
  }
})
export default class ImageLibrary extends Vue {
  name = 'image-library';
  images: ImageCardProps[] = [];
  gs = 'https://firebasestorage.googleapis.com/v0/b';
  
  created() {
    CloudStorageModule.updateBucketName('images');
    this.getImageDetailsFromStorage()
    .then(files => {
      const fileList = files;
      console.log('%c⧭', 'color: #0088cc', fileList)
      this.getFileUrls(fileList).then(
        urlList => {
          this.images = urlList;
          console.log('%c⧭', 'color: #00bf00', this.images)
        });
    });
  }

  private getImageDetailsFromStorage(): Promise<BucketImage[]> {
    let fileList: BucketImage[] = [];
    CloudStorageModule.updateBucketName('images');
    return new Promise((resolve, reject) => {
      CloudStorageModule.getImagesFromBucket()
      .then(files => {
        fileList = (files as BucketImage[]);
        console.log('%c⧭', 'color: #917399', fileList)
        resolve(fileList);
      });
    });
  }

  private getFileUrls(fileList: BucketImage[]): Promise<ImageCardProps[]> {
    const images: ImageCardProps[] = [];
    return new Promise((resolve, reject) => {
      CloudStorageModule.getFileUrl(fileList)
        .then(result => {
          console.log('%c⧭', 'color: #f200e2', result)
          const theFiles = result as BucketImage[];
          console.log('%c⧭', 'color: #ffa640', theFiles.length)
          theFiles.forEach(bucketImage => {
            console.log('%c⧭', 'color: #00b300', bucketImage)
            const image: ImageCardProps = {
              url: bucketImage.fullPath,
              title: bucketImage.name,
              tags: ['xxx', 'yyy']
            };
            images.push(image);
          })
          console.log('%c⧭', 'color: #1d5673', images)
          resolve(images);
        })
    })
  }

  get getImages() {
    return this.images;
  }
}
</script>