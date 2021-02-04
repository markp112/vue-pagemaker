<template>
  <section>
    <div class="relative">
      <div 
        class="w-8 h-8 border border-gray-200 cursor-pointer relative"
        v-bind:style="{ backgroundColor: getColour() }"
        @click="emitColour()"
        @mouseover="showTooltip=true"
        @mouseleave="showTooltip=false"
      >
        <tooltip
          style="top:20px"
          :tooltip="tooltip"
          :showToolTip="showTooltip" 
        >
        </tooltip>
      </div>
      <img
        :src="getPath('down-24.png')" 
        class="w-4 h-4 cursor-pointer hover:bg-gray-800 top-0 right-0 absolute"
        @click="isShow=!isShow"
      />
    </div>
    <colour-palette-sidebar
      v-if="isShow"
      class="absolute v-10"
      @colour="emitColour($event)"
    >
    </colour-palette-sidebar>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import ColourPaletteSidebar from './colour-palette-sidebar/colour-palette-sidebar.vue';
import ToolTip from '../../notifications/tooltip/tooltip.vue';
import { Emit } from 'vue-property-decorator';
import { Colour } from '@/classes/colour/singleton-colour';

@Component({
  components: {
    'colour-palette-sidebar': ColourPaletteSidebar,
    'tooltip': ToolTip,
  },
  props: {
    colourProp: {
      default: '',
    },
    tooltip: { default: '' }
  }
})
export default class ColourDropdown extends Vue {
  name='colour-dropdown';
  private colourStore: Colour =  Colour.getInstance();
  isShow = false;
  private showTooltip = false;

  @Emit('onColourChange') 
  emitColour(): string {
    this.isShow=false;
    return this.colourStore.rgbColour;
  }

  getColour(): string {
    return this.$props.colourProp !== '' ? this.$props.colourProp : this.colourStore.rgbColour;
  }


  getPath(image: string): string {
    const path = require.context('@/assets/icons',false,/\.png$/);
    return path(`./${image}`);
  }
}
</script>
