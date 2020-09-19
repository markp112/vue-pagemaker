<template>
  <div class="flex flex-col justify-start border-gray-800">
    <div class="w-6/12 h-48" :style="{backgroundColor: $props.primary}">
      <span>Primary</span>
    </div>

  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
  props: {
    primary: {
      default: (): string => {
        return "#2d3748";
      }
    }
    }
  }
)
export default class MaterialTemplate extends Vue {
  
}
</script>