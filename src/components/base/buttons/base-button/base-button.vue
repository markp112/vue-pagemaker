<template>
  <span class="button"
    :class="getClasses"
    @click="onClick()"
  >
  {{ $props.label }}
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit } from 'vue-property-decorator';

@Component({
  props: {
    label: {
      default: '',
    },
    bgColour: { default: 'bg-gray-600' },
    textColour: { default: 'text-white' },
    size: { default: 'medium' }   
  }
})
export default class BaseButton extends Vue {
  name = 'base-button';

  @Emit('onClick')
  onClick() {
    return;
  }

  get getClasses(): string {
    return `${this.$props.bgColour} ${this.$props.textColour} button-${this.$props.size}`
  }
}
</script>

<style lang="css" scoped>

  .button {
    @apply rounded-lg;
    @apply p-2;
    @apply inline-block;
    @apply cursor-pointer;
    @apply bg-siteLight;
    @apply text-accent2;
    @apply text-center;
  }

  .button:hover {
    @apply bg-siteSecondary;
    @apply text-siteSurface;
  }

  .button-medium {
    @apply w-24;
    @apply h-10;
  }

  .button-small {
    @apply w-16;
    @apply h-8;
    @apply text-sm;
    @apply p-1;
    @apply rounded-md;
  }

  .button-x-small {
    @apply w-12;
    @apply h-6;
    @apply text-xs;
    @apply p-1;
    @apply rounded-md;
  }

</style>