<template>
  <div class="pill" :class="getClasses">
    <span class="w-2 h-12 rounded-l-lg -ml-1 inline-block"
        :class="$props.pillColour"
    >
      
    </span>
    <span class="pl-1 overflow-hidden">
      {{ $props.label }}
    </span>
    <img
      class=" w-4 h-4 cursor-pointer hover:bg-blue-500 rounded-full"
      :src="getPath('close-24.png')" alt="click here to remove tag"
      @click="removeTagClick()"
    >
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Emit } from 'vue-property-decorator';

type PillSize = | 'small' | 'medium' | 'large';

@Component({
  props: {
    pillColour: { default: 'bg-red-500' },
    label: { default: '' },
    size: { default: 'medium' }
  },
})
export default class ImagePill extends Vue {
  name = 'imagePill';

  @Emit("removeClick")
  removeTagClick(): string {
    return this.$props.label;
  }

  getPath(image: string): string {
    const path = require.context("@/assets/icons", false, /\.png$/);
    return path(`./${image}`);
  }

  get getClasses() {
    return `pill-${this.$props.size}`;
  }
    
  
}
</script>

<style lang="css" scoped>
  .pill {
    @apply overflow-hidden;
    @apply flex;
    @apply flex-row;
    @apply flex-nowrap;
    @apply rounded-full;
    @apply items-center;
    @apply justify-between;
    @apply border;
    @apply border-gray-200;
    @apply font-semibold;

  }

  .pill-small {
    @apply text-xs;
    @apply w-24;
    @apply h-6;
    @apply px-1;
  }

  .pill-medium {
    @apply w-32;
    @apply h-8;
    @apply text-sm;
    @apply py-1;
    @apply px-1;
  }
  
  .pill-large {
    @apply w-40;
    @apply h-10;
    @apply text-lg;
    @apply py-1;
    @apply px-1;
  }
</style>
