<template>
  <section class="flex flex-row flex-wrap justify-evenly text-xs">
    <span v-for="pill in $props.pills"
      :key="pill[0]"
      class="rounded-full w-auto h-auto px-2 mt-1 cursor-pointer border-gray-600 border text-center hover:bg-site-secondary-light hover:text-siteSurface"
      :class="{ selected: isSelected(pill[0]) }"
      @click="pillClicked(pill)"
    >
    {{ pill[0] }}
    </span>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit } from 'vue-property-decorator';

export type Tuple = [string, string];

@Component({
  props: {
    pills: {
      default:(): Tuple[] => { return [] }
    }
  }
})
export default class ColourPills extends Vue{
  clickedPill = '';

  isSelected(thisPill: string): boolean {
    return thisPill === this.clickedPill;
  }

  @Emit('onChange')
  pillClicked(pill: Tuple) {
    this.clickedPill = pill[0];
    return pill[1];
  }
}
</script>

<style lang="postcss" scoped>
  .selected {
    @apply bg-siteSecondary;
    @apply text-siteSurface;
  }
</style>