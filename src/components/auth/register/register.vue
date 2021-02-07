<template>
  <section>
    <horizontal-image-text>
      <img
        slot="image-content"
        src="@/assets/images/registration.jpg"
        alt="picture of a bank vault"
        class="object-cover w-3/6 h-full"
      />
      <register-form slot="text-content"></register-form>
    </horizontal-image-text>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import HorizontalImageText from "@/components/base/layouts/app-templates/horizontal-image-text/horizontal-image-text.vue";
import RegisterForm from "./register-template.vue";

@Component({
  components: {
    "horizontal-image-text": HorizontalImageText,
    "register-form": RegisterForm
  }
})
export default class Register extends Vue {}
</script>

<style lang="postcss">
.input-control {
  @apply block border-2 rounded-md w-full p-1;
}
</style>
