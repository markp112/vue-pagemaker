<template>
  <div>
    <horizontal-image-text>
      <img
        slot="image-content"
        src="@/assets/images/bank-vault.jpg"
        alt="picture of a bank vault"
        class="object-cover w-3/6 h-full"
      />
      <login-form slot="text-content"></login-form>
    </horizontal-image-text>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import HorizontalImageText from "@/components/base/layouts/app-templates/horizontal-image-text/horizontal-image-text.vue";
import LoginForm from "./login-template.vue";

@Component({
  components: {
    "horizontal-image-text": HorizontalImageText,
    "login-form": LoginForm
  }
})
export default class Login extends Vue {
  name = "login";
}
</script>
