<template>
  <div class="sidebar-button-panel">
    <img src="@/assets/icons/align_vertical_left-32.png" 
      class="text-accent cursor-pointer hover:bg-secondary-100" 
      @click="alignStartClick" />
    <img src="@/assets/icons/align_horizontal_center-32.png" 
      class="text-accent cursor-pointer hover:bg-secondary-100" 
      @click="alignCenterClick" />
    <img src="@/assets/icons/space_evenly_horizontal-32.png" 
      class="text-accent cursor-pointer hover:bg-secondary-100" 
      @click="alignEvenlyClick" />
    <img src="@/assets/icons/icons8-add-white-space-32.png" 
      class="text-accent cursor-pointer hover:bg-secondary-100" 
      @click="alignBetweenClick" />
    <img src="@/assets/icons/align_vertical_right-32.png" 
      class="text-accent cursor-pointer hover:bg-secondary-100" 
      @click="alignEndClick" />
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import { Emit } from 'vue-property-decorator';

  @Component
  export default class JustificationButtons extends Vue {
    name = 'JustificationButtons';
    // indent = require('@/assets/icons/')
    
    @Emit('alignStartClick') alignStartClick() {
      return;
    }

    @Emit('alignCenterClick') alignCenterClick() {
      return;
    }

    @Emit('alignEvenlyClick') alignEvenlyClick() {
      return;
    }

    @Emit('alignBetweenClick') alignBetweenClick() {
      return;
    }
    
    @Emit('alignEndClick') alignEndClick() {
      return;
    }
  }
</script>