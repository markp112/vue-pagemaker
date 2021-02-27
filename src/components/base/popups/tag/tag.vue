<template>
  <div class="border border-siteSecondary bg-siteSurface shadow-lg max-w-xs w-48 text-sm">
    <p class="bg-siteLight text-siteSurface p-1 text-xs">Add Tag</p>
    <div class="py-2 px-1">
      <input type="text" name="" id="" placeholder="enter a new tag" class="input">
      <base-button size="x-small" label="Ok" @onClick="onClick()"></base-button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import BaseButton from '@/components/base/buttons/base-button/base-button.vue';
import { Emit } from 'vue-property-decorator';

@Component({
  components: {
    'base-button': BaseButton,
  }
})
export default class Tag extends Vue {
  name = 'tag';

  @Emit('onClick')
  onClick() {
    return;
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