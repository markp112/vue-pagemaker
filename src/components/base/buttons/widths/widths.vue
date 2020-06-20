<template>
  <div class="font-widths flex flex-row justify-evenly text-sm bg-gray-300 p-2 h-10 mt-2 h-12">
    <span class="circle-widths" @click="click(20)">20%</span>
    <span class="circle-widths" @click="click(40)">40%</span>
    <span class="circle-widths" @click="click(50)">50%</span>
    <span class="circle-widths" @click="click(60)">60%</span>
    <span class="circle-widths" @click="click(80)">80%</span>
    <span class="circle-widths" @click="click(100)">100%</span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit } from 'vue-property-decorator';

@Component
export default class WidthsButtons extends Vue{
  @Emit('setWidthClick') click(value: number){

    return value;
  }
}
</script>

<style lang="postcss" scoped>
.circle-widths {
  @apply rounded-full bg-secondary-900 text-accent-600 h-8 w-8 flex items-center justify-center cursor-pointer;
}
.circle-widths:hover {
  @apply bg-secondary-100 text-accent1;
}
</style>