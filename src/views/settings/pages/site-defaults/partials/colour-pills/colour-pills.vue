<template>
  <section class="flex flex-row justify-evenly">
    <span v-for="pill in $props.pills"
      :key="pill"
      class="rounded-md w-auto p-2 h-10 cursor-pointer"
      :class="{isSelected(pill[0]): selected}
    >
    {{ pill[0] }}
    </span>

  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

type Tuple = [string, string];

@Component({
  props: {
    pills: {
      default:(): Tuple[] => { return [] }
    }
  }
})
export default class ColourPills extends Vue{
  
}
</script>

<style lang="postcss" scoped>
  .selected {
    @apply bg-siteSecondary;
    @apply text-accent-600;
  }
</style>