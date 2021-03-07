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
    bgColour: { default: 'bg-siteLight' },
    textColour: { default: 'text-accent2' },
    size: { default: 'medium' },
    disabled: { default: false },  
  }
})
export default class BaseButton extends Vue {
  name = 'base-button';

  @Emit('onClick')
  onClick() {
    return;
  }

  get getClasses(): string {
    const size = `button-${this.$props.size}`;
    if (this.$props.disabled) {
      return `bg-gray-500 text-bg-gray-200 ${size}`;
    }
    const classes = `cursor-pointer 
      ${this.$props.bgColour} 
      ${this.$props.textColour} 
      ${size}
      hover:bg-siteSecondary hover:text-siteSurface`
    return classes 
  }
}
</script>

<style lang="css" scoped>

  .button {
    @apply rounded-lg;
    @apply p-2;
    @apply inline-block;
    @apply text-center;
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
    @apply w-auto;
    @apply min-w-12;
    @apply h-6;
    @apply text-xs;
    @apply p-1;
    @apply rounded-md;
  }

</style>
