<template>
  <div class="w-full flex flex-row flex-wrap">
    <p class="w-1/12">
      {{ $props.label }}
    </p>
    <span
      class="h-16 w-16 text-xs text-center flex flex-col justify-end cursor-pointer"
      v-for="(colour, index) in $props.palette"
      :key="index + colour"
      :style="{ backgroundColor: colour, color: getFontColour(index) }"
      @click="colourClicked(colour)"
    >
      {{ colour }}
    </span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit } from 'vue-property-decorator';

@Component({
  props: {
    palette: {
      default: (): string[] => {
        return [];
      },
    },
    label: { default: '' },
  },
})
export default class PaletteStrip extends Vue {
  name = 'Palette-strip';

  getFontColour(index: number): string {
    const BLACK = '#000000';
    const WHITE = '#ffffff';
    return index < 5 ? BLACK : WHITE;
  }

  @Emit('colourClicked')
  colourClicked(colour: string) {
    return colour;
  }
}
</script>
