<template>
  <div class="h-4/5 w-full">
    <div class="flex flex-row justify-between w-full h-16 border-b-2 border-gray-500">
      <p>Image Library</p>
      <dropdown-select></dropdown-select>
      <close-button></close-button>
    </div>
    <div class="flex flex-row flex-wrap w-full p-2 justify-evenly overflow-y-scroll h-full">
      <image-card
        v-for="(image, index) in getImages"
        :image="image"
        :key="index"
        class="mt-4"
        @addTag="addTag($event)"
      >
      </image-card>
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
  tags: string[] = [];
  
  created() {
    this.images = [];
    CloudStorageModule.updateBucketName('images');
    this.getImageDetailsFromStorage()
    .then(files => {
      const fileList = files;
      this.getFileUrls(fileList);
      this.getTags(fileList);
    });
  }

  private getImageDetailsFromStorage(): Promise<BucketImage[]> {
    let fileList: BucketImage[] = [];
    return new Promise((resolve, reject) => {
      CloudStorageModule.getImagesFromBucket()
      .then(files => {
        fileList = (files as BucketImage[]);
        resolve(fileList);
      });
    });
  }

  private getFileUrls(fileList: BucketImage[]) {
    fileList.forEach(bucketImage => {
      CloudStorageModule.getFileUrl(bucketImage.name)
      .then (url => {
        const image: ImageCardProps = {
            url: url,
            title: bucketImage.name,
            tags: [],
          };
        this.images.push(image);
      })
    });
  }

  private getTags(fileList: BucketImage[]) {
    fileList.forEach(bucketImage => {
      CloudStorageModule.getImageMetaData(bucketImage.name)
      .then (tags => {
        console.log('%c⧭', 'color: #00ff88', tags)
      })
    });
  }

  private addTag(tagAndImage: { imageName: string, tag: string }) {
      CloudStorageModule.addMetaData(tagAndImage);
      this.tags.push(tagAndImage.tag);
  }

  get getImages() {
    return this.images;
  }
}
</script>