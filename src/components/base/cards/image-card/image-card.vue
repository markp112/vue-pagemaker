<template>
  <div class="w-64 h-72 flex flex-col justify-start border border-siteSecondary rounded-sm shadow-md relative">
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
        :src="$props.image.url"
        ref="imageInCard"
      >
    </div>
    <div class="py-2 px-2 flex flex-row flex-wrap overflow-y-scroll">
      <p class="w-full sticky top-0">
        <base-button
          class="self-start"
          size="x-small"
          label="Add tag"
          @onClick="showAddTag=true"
        >
        </base-button>
      </p>
      <image-pill 
        v-for="tag in $props.image.tags"
        :key="tag"
        size="small"
        :label="tag"
        pillColour="bg-siteSecondary"
        class="ml-1 mt-1"
        @removeClick="removeTag($event)"
      >
      </image-pill>
    </div>
    <add-tag
      v-if="showAddTag"
      class="absolute top-44 left-8 z-50 h-20 w-full"
      @onCloseClick="showAddTag=false"
      @onOkClick="addTag($event)"
    ></add-tag>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit } from 'vue-property-decorator';
import ImagePill from '@/components/base/notifications/pills/image-pill/image-pill.vue';
import Tag from '@/components/base/popups/tag/tag.vue'
import BaseButton from '@/components/base/buttons/base-button/base-button.vue';
import firebase from 'firebase';

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
    'add-tag': Tag,
    'base-button': BaseButton,
  }
})
export default class ImageCard extends Vue {
  name = 'image-card';
  showAddTag = false;

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

  @Emit("addTag")
  addTag(tag: string): { imageName: string, tag: string } {
    if (!this.$props.image.tags.includes(tag)) {
      this.$props.image.tags.push(tag);
    };
    return {imageName: this.$props.image.title, tag:tag };
  }

  getPath(image: string): string {
    const path = require.context('@/assets/icons', false, /\.png$/);
    return path(`./${image}`);
  }
}
</script>