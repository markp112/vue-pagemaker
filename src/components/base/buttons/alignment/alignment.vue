<template>
  <div class="flex flex-row justify-evenly text-xl bg-gray-300 p-2 h-10">
    <font-awesome-icon 
      icon="align-left"
      prefix="fas" 
      class="text-accent cursor-pointer hover:text-secondary-100" 
      @click="alignLeftClick" />
    <font-awesome-icon 
      icon='align-center' 
      prefix="fas" 
      class="text-accent cursor-pointer hover:text-secondary-100" 
      @click="alignCenterClick" />
    <font-awesome-icon 
      icon='align-right' 
      prefix="fas" 
      class="text-accent cursor-pointer hover:text-secondary-100" 
      @click="alignRightClick" />
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import { Emit } from 'vue-property-decorator';

  @Component
  export default class AlignmentButtons extends Vue {
    name = "alignButtons";
    
    @Emit('alignLeftClick') alignLeftClick() {
      return;
    }
    @Emit('alignCenterClick') alignCenterClick() {
      return;
    }
    @Emit('alignRightClick') alignRightClick() {
      return;
    }
  }
</script>