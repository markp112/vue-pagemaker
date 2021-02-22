<template>
  <div class="pill">
    <span class="w-1 inline-block"
        :class="$props.pillColour"
    >
    </span>
    <span class="pl-1 bg-white overflow-hidden max-w-xs">
      {{ $props.label }}
    </span>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
import Component from 'vue-class-component'

  @Component({
    props: {
      pillColour: { default: 'bg-red-500' },
      label: { default: '' },
    }
  })
  export default class ImagePill extends Vue{
    name = 'imagePill'

    
  }
</script>

<style lang="css" scoped>
  .pill {
    @apply overflow-hidden;
    @apply w-32;
    @apply h-8;
    @apply flex;
    @apply flex-row;
    @apply flex-nowrap;
    @apply rounded-full;
    @apply justify-start;
    @apply border;
    @apply border-gray-200;
    @apply text-sm;
    @apply font-semibold;
    @apply py-1;
    @apply px-6;
  }

</style>
