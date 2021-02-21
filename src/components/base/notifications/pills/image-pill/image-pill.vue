<template>
  <div class="w-16 h10 flex flex-row rounded-lg justify-start">
    <span class="w-4"
        :class="$props.pillColour"
    >
    </span>
    <span class="text-sm p2 bg-white"></span>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
import Component from 'vue-class-component'

  @Component({
    props: {
      pillColour: {default: 'bg-red-500'}
    }
  })
  export default class ImagePill extends Vue{
    name = 'imagePill'

    
  }
</script>
