<template>
  <div class="sidebar-button-panel">
    <img src="@/assets/icons/align_left-32.png" 
          class=" cursor-pointer hover:bg-gray-800"
          @click="alignClick('left')"
    />
    <img src="@/assets/icons/align_center-text-32.png" 
        class=" cursor-pointer hover:bg-gray-800"
        @click="alignClick('center')"
    />
    <img src="@/assets/icons/align_right-32.png" 
        class=" cursor-pointer hover:bg-gray-800"
        @click="alignClick('right')"
    />
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit } from 'vue-property-decorator';
import { Style } from '../../../../../models/styles/styles';

type TextAlignmentTypes = 'left' | 'center' | 'justify' | 'right';


@Component
export default class TextAlignment extends Vue {
  name = "text alignment";

  @Emit('alignClick')
  alignClick(align: TextAlignmentTypes) {
    const style = `text-${align}`;
    return style;
  }
}

</script>