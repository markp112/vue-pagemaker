<template>
  <img
    src="@/assets/icons/close-24.png"
    alt="close button"
    class="cursor-pointer hover:bg-siteBackground rounded-full h-6 w-6"
    @click="onClick()"
  />
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Emit } from "vue-property-decorator";

@Component
export default class CloseButton extends Vue {
  name = "CloseButton";

  @Emit("onClick") onClick() {
    return;
  }
}
</script>
