<template>
  <p class="mr-12 mt-2 font-medium">Create New
    <font-awesome-icon v-
      icon='plus-circle' 
      prefix="fas" 
      class="text-accent icon-size ml-3 mr-12 cursor-pointer hover:text-secondary" 
      @click="onClick()" />
  </p>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import { Emit } from 'vue-property-decorator';

  @Component
  export default class CreateNewButton extends Vue {
    name = "CreateNewButton";
    
    @Emit('onClick') onClick() {
      console.log("button clicked")
    }
  }
</script>