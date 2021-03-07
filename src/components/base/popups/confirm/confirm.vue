<template>
  <div class="w-44 h-auto flex flex-col justify-start border border-gray-300 rounded-md shadow-lg bg-siteSurface text-onSurface">
    <p class="text-center border-b border-gray-300 overflow-hidden text-sm bg-pink-800 text-onPrimary rounded-t-md">
      {{ message }}
    </p>
    <div class="flex flex-row justify-between px-2 my-4">
      <base-button label="Yes" size="x-small" @onClick="yesClicked()"></base-button>
      <base-button label="No" size="x-small" @onClick="noClicked()"></base-button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit } from 'vue-property-decorator';
import BaseButton from '../../buttons/base-button/base-button.vue';

@Component({
  props: {
    message: { default: '' },
  },
  components: {
    'base-button': BaseButton
  }
})
export default class Confirm extends Vue {
  name = "confirm-dialog"

  @Emit("yesClicked")
  yesClicked() {
    return;
  }

  @Emit("noClicked")
  noClicked() {
    return;
  }

}
</script>