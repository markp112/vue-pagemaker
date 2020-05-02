<template>
  <div class="flex flex-row justify-evenly text-xl bg-gray-300 p-2 h-10">
    <img src="@/assets/icons/align_horizontal_top-32.png" 
      class="text-accent cursor-pointer hover:bg-secondary-100" 
      @click="alignTopClick" />
    <img src="@/assets/icons/distribute_vertical_center.png" 
      class="text-accent cursor-pointer hover:bg-secondary-100" 
      @click="alignVerticalCenterClick" />
    <img src="@/assets/icons/align_horizontal_bottom-32.png" 
      class="text-accent cursor-pointer hover:bg-secondary-100" 
      @click="alignBottomClick" />
  
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import { Emit } from 'vue-property-decorator';

  @Component
  export default class VerticalAlignmentButtons extends Vue {
    name = 'JustificationButtons';
    // indent = require('@/assets/icons/')
    
    @Emit('alignTopClick') alignTopClick() {
      return;
    }

    @Emit('alignVerticalCenterClick') alignVerticalCenterClick() {
      return;
    }

    @Emit('alignBottomClick') alignBottomClick() {
      return;
    }
  }
</script>