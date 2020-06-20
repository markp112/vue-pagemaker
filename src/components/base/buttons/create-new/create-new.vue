<template>
  <p class="mr-12 mt-2 font-medium">Create New
    <font-awesome-icon 
      icon='plus-circle' 
      prefix="fas" 
      class="text-accent-600 ml-3 cursor-pointer hover:text-secondary-100" 
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
      return
    }
  }
</script>