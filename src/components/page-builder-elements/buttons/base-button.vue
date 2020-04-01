<template>
  <span class="inline-block w-auto p-2 h-8 border border-gray-600 cursor-pointer" @click="onClick()">{{buttonLabel}}</span>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Emit } from 'vue-property-decorator'

@Component({
  props:{
    buttonLabel: {default: "click me"},
  }
})
export default class BaseButton extends Vue {

  @Emit('onClick')
  onClick(){
    return
  }

}
</script>