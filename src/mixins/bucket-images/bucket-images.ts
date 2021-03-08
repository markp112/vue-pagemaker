import { ImageCardProps } from '@/components/base/cards/image-card/models/image-card-models';
import { BucketImage } from '@/store/services/models/bucket-image';
import { CloudStorageModule } from '@/store/services/storage';
import Vue from 'vue';
import Component from 'vue-class-component';


@Component
export class BucketImagesMixin extends Vue {
  name='BucketImagesmixin';
  images: ImageCardProps[] = [];
  tags: string[] = [];
  filters: string[] = [];

  getImagesFromBucket() {
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
}