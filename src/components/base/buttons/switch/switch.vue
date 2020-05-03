<template>
  <label class="switch">
    <input type="checkbox" @click="onToggle">
    <span class="slider round"></span>
  </label>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit } from 'vue-property-decorator';

@Component
export default class ToggleSwitch extends Vue {

  private isOn = false;

  @Emit('onToggle')
  onToggle(){
    this.isOn = !this.isOn;
    return this.isOn;
  }
}
</script>

<style lang="postcss" scoped>
.switch {
  @apply relative inline-block;
  width: 50px;
  height: 22px;
}
.switch input {
  @apply opacity-0 w-0 h-0;
}
.slider {
  @apply absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-700 duration-75;
}

.slider.round {
  @apply rounded-full py-2 px-4;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
 @apply bg-gray-500;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(28px);
  -ms-transform: translateX(28px);
  transform: translateX(28px);
}

/* Rounded sliders */

.slider.round:before {
  border-radius: 50%;
}

</style>