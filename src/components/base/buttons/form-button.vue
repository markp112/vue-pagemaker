<template>
<button type="cancel" @click="onClick()">{{ label }}</button>
</template>

<script lang="ts">

import Component  from 'vue-class-component';
import { Prop, Vue, Emit } from 'vue-property-decorator';

@Component({
    props: {
      label: {
        default: "",
      }
    }
})
export default class FormButton extends Vue {


  @Emit('onClick') onClick() {
    console.log("button clicked")
  }
}


</script>

<style lang="postcss" scoped>

  button {
    min-width: 100px;
    @apply bg-gray-600 py-1 px-3 rounded-md text-white ;
  }
</style>