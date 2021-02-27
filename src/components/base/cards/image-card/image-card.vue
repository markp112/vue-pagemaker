<template>
  <div class="w-64 h-72 flex flex-col justify-start border border-siteSecondary rounded-sm shadow-md">
    <div
      ref="card-header" 
      class="flex flex-row justify-between text-sm p-1 bg-sitePrimary text-siteSurface">
      <span>{{ $props.image.title }}</span>
      <img 
        class="cursor-pointer hover:bg-siteDark rounded-full"
        src="@/assets/icons/trash_can-32.png"
        alt="delete image"
        @click="deleteImage($props.image.url)"
      >
    </div>
    <div
      class="cursor-pointer h-44 w-64"
      ref="card-body"
      @click="imageSelected($props.image.url)"
    >
      <img class="block h-44 w-full"
        style="background-size:contain; background-repeat:no-repeat; background-position: center"
        :style="getBackgroundImage()"
      >
    </div>
    <div class="py-2 px-2 flex flex-row flex-wrap">
      <image-pill 
        v-for="tag in $props.image.tags"
        :key="tag"
        size="small"
        :label="tag"
        pillColour="bg-siteSecondary"
        class="ml-1 mt-1"
        @removeClick="removeTag($event)"
      ></image-pill>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit } from 'vue-property-decorator';
import ImagePill from '../../notifications/pills/image-pill/image-pill.vue';

export interface ImageCardProps {
  title: string;
  tags: string[];
  url: string;
}

@Component({
  props: {
    image: { 
      default: (): ImageCardProps => { 
        return {
          title: '',
          tags: [],
          url: ''
        } 
      },
    },
  },
  components: {
    'image-pill': ImagePill,
  }
})
export default class ImageCard extends Vue {
  name = 'image-card';

  @Emit('removeTag')
  removeTag(tag: string) {
    return tag;
  }

  @Emit('deleteImage')
  deleteImage(url: string) {
    return url;
  }

  @Emit('imageSelected')
  imageSelected(url: string) {
    return url;
  }

  getBackgroundImage(): string {
    const style = `background-image: url(${this.$props.image.url})`;
    return style;
  }

  getPath(image: string): string {
    const path = require.context('@/assets/icons', false, /\.png$/);
    return path(`./${image}`);
  }
}
</script>