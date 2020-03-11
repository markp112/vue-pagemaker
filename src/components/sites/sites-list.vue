<template>
  <div>
    <p>My Sites</p>
    <p>Create New
        <font-awesome-icon 
        icon='plus-circle' 
        prefix="fas" 
        class="text-accent2 icon-size ml-3 cursor-pointer hover:text-accent" 
        @click="chevronClicked" />
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';

@Component
export default class SitesList extends Vue {
 
 
}
</script>