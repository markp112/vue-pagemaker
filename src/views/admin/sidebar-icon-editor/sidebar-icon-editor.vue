<template>
  <div class="flex flex-row justify-start">
    <div class="flex flex-col justify-start align-top w-3/12 border-gray-500 h-full">
      <ul>
        <li v-for="icon in Icons" :key="icon.name">
          <font-awesome-icon :icon="icon.icon" :prefix="icon.prefix" @click="iconClicked(icon.name)"/>
        </li>
      </ul>
    </div>  
    <div class="flex flex-col justify-evenly w-9/12">
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class SidebarIconEditor extends Vue {
  
  


}
</script>