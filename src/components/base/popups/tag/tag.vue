<template>
  <div class="border border-siteSecondary bg-siteSurface shadow-lg max-w-xs w-48 text-sm">
    <p class="bg-siteLight text-siteSurface p-1 text-xs flex flex-row justify-between flex-nowrap">
      <span>Add Tag</span>
      <close-button @onClick="onCloseClick()"></close-button>
    </p>
    <div class="py-2 px-1">
      <input
        type="text"
        ref="tag-input"
        placeholder="enter a new tag"
        class="input"
        @keyup="onInputChange()"
      >
      <base-button
        size="x-small"
        label="Ok"
        @onClick="onOkClick()"
        :disabled="disabled"
      >
      </base-button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import BaseButton from '@/components/base/buttons/base-button/base-button.vue';
import CloseButton from '@/components/base/buttons/close-button/close-button.vue';
import { Emit } from 'vue-property-decorator';

@Component({
  components: {
    'base-button': BaseButton,
    'close-button': CloseButton,
  }
})
export default class Tag extends Vue {
  name = 'tag';
  disabled = true;

  @Emit('onOkClick')
  onOkClick(): string {
    const tag = (this.$refs['tag-input'] as HTMLInputElement).value;
    return tag;
  }

  @Emit('onCloseClick')
  onCloseClick() {
    return;
  }

  onInputChange(): void {
    const tag = (this.$refs['tag-input'] as HTMLInputElement).value;
    this.disabled = tag.length === 0;
  }

}
</script>

<style lang="css" scoped>
  .input {
    @apply w-32;
    @apply border-0;
    @apply border-b-2;
    @apply border-gray-500;
    @apply outline-none;
    @apply text-sitePrimary;
    @apply px-2;
    @apply bg-transparent;
  }
</style>