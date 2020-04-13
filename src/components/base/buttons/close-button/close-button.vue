<template>
    <font-awesome-icon 
      icon='times-circle' 
      prefix="far" 
      class="text-accent ml-3 cursor-pointer hover:text-secondary-100" 
      @click="onClick()" />
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import { Emit } from 'vue-property-decorator';

  @Component
  export default class CloseButton extends Vue {
    name = "CloseButton";
    
    @Emit('onClick') onClick() {
      return
    }
  }
</script>