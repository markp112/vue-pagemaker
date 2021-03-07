<template>
  <div class="h-4/5 w-full">
    <div class="flex flex-row justify-between w-full h-16 border-b-2 border-gray-500">
      <p>Image Library</p>
      <dropdown-select
        :listItems="tags"
        label="Filter by tag(s)"
        @itemClick="applyFilter($event)"
        @removeItem="applyFilter($event)"
      >
      </dropdown-select>
      <close-button></close-button>
    </div>
    <div class="flex flex-row flex-wrap w-full p-2 justify-evenly overflow-y-scroll h-full">
      <image-card
        v-for="(image) in getImages"
        :image="image"
        :key="image.title"
        class="mt-4"
        @addTag="addTag($event)"
        @deleteImage="deleteImageClicked($event)"
      >
      </image-card>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import ImageCard from '@/components/base/cards/image-card/image-card.vue';
import DropdownMultiSelect from '@/components/base/pickers/dropdown-multi-select/dropdown-multi-select.vue';
import CloseButton from '@/components/base/buttons/close-button/close-button.vue';
import Component from 'vue-class-component';
import { CloudStorageModule } from '@/store/services/storage';
import { BucketImage } from '@/store/services/models/bucket-image';
import { ImageCardProps } from '@/components/base/cards/image-card/models/image-card-models';

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
  filters: string[] = [];

  filterArray = (array: string[], filterBy: string[]) => {
    const filtered = array.filter(el => {
      return filterBy.find(element => {
        return element === el;
      })
    });
    return filtered;
  }
  
  created() {
    this.images = [];
    CloudStorageModule.updateBucketName('images');
    this.getImageDetailsFromStorage()
    .then(files => {
      const fileList = files;
      this.getFileUrls(fileList);
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
        CloudStorageModule.getImageMetaData(bucketImage.name)
        .then (tags => {
          if (tags.length > 0) {
            image.tags = tags;
            this.addTagsToTags(tags)
          }
          this.images.push(image);
        })  
      });
    });
  }

  addTagsToTags(tags: string[]) {
    const tempTags = new Set([...this.tags, ...tags]);
    this.tags = [...tempTags];
    this.tags.sort();
  }


  get getImages(): ImageCardProps[] {
    if (this.filters.length > 0) {
      return this.images.filter(image => {
        const matched = this.filterArray(image.tags, this.filters)
        if (matched.length > 0) return image 
      });
    }
    return this.images;
  }  

  private applyFilter(tags: string[]): void {
    this.filters = tags;
  }

  private addTag(tag: string): void {
    const tags = this.tags;
    if (tags.includes(tag)) {
      return;
    }
    this.tags.sort();
  }

  private deleteImageClicked(fileName: string): void {
    console.log("delete clicked")
    CloudStorageModule.deleteFile(fileName)
    .then(() => {
      this.images = this.images.filter(image => image.title !== fileName);
    })
  }


}
</script>