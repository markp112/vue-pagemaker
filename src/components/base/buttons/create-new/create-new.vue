<template>
  <p class="mr-12 mt-2 font-medium">Create New
    <img src="@/assets/icons/add-circle-32.png"
      class="ml-3 cursor-pointer hover:bg-site-secondary-light" 
      @click="onClick()"
    >
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