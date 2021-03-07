<template>
  <transition name="fade">
    <div
      v-show="show"
      class="absolute text-xs z-20 tooltip-box dropdown-menu-background border-t-4 border-secondary-300
          rounded-md py-2 shadow-lg tooltip-box w-32 text-center text-onSurface"
      role="alert"
    >
      {{ $props.tooltip }}
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component({
  props: {
    showToolTip: {
      default: false
    },
    tooltip: {
      default: ""
    }
  }
})
export default class ToolTip extends Vue {
  get show(): boolean {
    return this.$props.showToolTip;
  }
}
</script>

<style lang="css">
.fade-enter-active {
  transition: opacity 0.5s;
}

.fade-leave-active {
  transition: opacity 0.7s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.tooltip-box {
  height: auto;
  right: -129px;
  top: 0%;
}
</style>
