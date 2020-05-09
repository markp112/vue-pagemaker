<template>
  <transition name="fade">
    <div v-show="show" 
      class="absolute text-xs z-20 tooltip-box bg-teal-100 border-t-4 border-teal
          radius text-teal-darkest px-4 py-2 shadow tooltip-box"
      role="alert"
    >
    {{ $props.tooltip }}
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
  props: {
    showToolTip: {
      default: false
    },
    tooltip: {
      default: ''
    },
  },
})
export default class ToolTip extends Vue {
  get show(): boolean {
    return this.$props.showToolTip;
  }
}
</script>

<style lang="postcss">

.fade-enter-active {
  transition: opacity 0.5s;
}

.fade-leave-active {
  transition: opacity 0.7s;
}
.fade-enter, .fade-leave-to  {
  opacity: 0;
}
.tooltip-box {
  height: auto; 
  min-height: 200%; 
  left: 115%;
  top: 0%;
  min-width: 200px;
  @media screen and (min-width: 40em) {
    min-width: 400px;
  }
}