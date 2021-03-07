<template>
  <button type="cancel" @click="onClick()">{{ label }}</button>
</template>

<script lang="ts">
import Component from "vue-class-component";
import { Vue, Emit } from "vue-property-decorator";

@Component({
  props: {
    label: {
      default: '',
    },
  },
})
export default class FormButton extends Vue {
  name = 'form-button';
  
  @Emit('onClick')
  onClick() {
    return;
  }
}
</script>

<style lang="css" scoped>
.button {
  min-width: 100px;
  @apply bg-gray-600;
  @apply py-1;
  @apply px-3;
  @apply rounded-md;
  @apply text-white;
}
</style>
