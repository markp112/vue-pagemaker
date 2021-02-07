<template>
  <div class="flex justify-center items-center flex-row h-auto mt-32 ">
    <div class="flex flex-row justify-start w-full h-full">
      <slot name="image-content"> </slot>
      <div
        class="border-2 rounded-md p-5 text-left w-3/6 h-100 flex flex-col justify-start"
      >
        <slot name="text-content"> </slot>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class HorizontalImageText extends Vue {
  name = "HorizontalImageText";
}
</script>
