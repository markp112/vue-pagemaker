<template>
  <div>
    <p class="text-center text-2xl font-bold">Welcome Back</p>
    <p class=" text-lg font-bold mt-4 mb-4">Login</p>
    <form @submit.prevent="submitClick" class="mt-6 w-4/6 ml-8">
      <label for="email" class="text-sm">E-Mail</label>
      <input
        type="email"
        id="email"
        v-model="email"
        class="input-control"
        placeholder="E-mail address"
        required
      />
      <label for="password" class="text-sm mt-4 block">Password</label>
      <input
        type="password"
        id="password"
        v-model="password"
        class="input-control"
        placeholder="Password"
        required
      />
      <div class="flex justify-between flex-row mt-12">
        <button
          type="button"
          class="bg-gray-600 py-1 px-3 rounded-md text-white"
          click="cancelClick()"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="bg-blue-600 py-1 px-3 rounded-md text-white"
          click="submitClick()"
        >
          Submit
        </button>
      </div>
      <div class="error" v-if="formErrors.length > 0">
        <p v-for="error in formErrors" :key="error">{{ error }}</p>
      </div>
      <div v-if="loginFailed" class="error">
        Invalid user name or password
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { UserInterface } from "@/models/user/user";
import { ErrorCodes } from "@/models/enums/errors/errors";
import { AuthModule } from "@/store/auth/auth";
import HorizontalImageText from "@/components/base/layouts/app-templates/horizontal-image-text/horizontal-image-text.vue";

@Component({
  components: {
    "horizontal-image-text": HorizontalImageText
  }
})
export default class LoginForm extends Vue {
  name = "login-form";
  email = "";
  password = "";
  formErrors: string[] = [];
  loginFailed = false;

  submitClick(): void {
    this.loginFailed = false;
    if (this.validateForm()) {
      const user: UserInterface = {
        email: this.email,
        password: this.password,
        signedIn: false,
        id: "",
        refreshToken: ""
      };
      AuthModule.login(user)
        .then(firebaseUser => {
          const user = firebaseUser as UserInterface;
          window.localStorage.setItem(
            "pmToken",
            user.refreshToken ? user.refreshToken : ""
          );
          window.localStorage.setItem("pmEmail", user.email);
          window.localStorage.setItem("id", user.id);

          this.$router.push("/sites");
        })
        .catch(err => {
          if (err === ErrorCodes.LoginFailed) {
            this.formErrors = [];
            this.formErrors.push("Invalid user name or password");
          } else {
            this.formErrors = [];
            this.formErrors.push(err);
          }
        });
    }
  }

  cancelClick() {
    this.$router.push("/");
  }

  private validateForm(): boolean {
    return true;
  }
}
</script>

<style lang="postcss" scoped>
.input-control {
  @apply block border-2 rounded-md w-full p-1;
}

.error {
  @apply bg-red-600 text-white w-full mt-2 rounded-md p-2 text-sm;
}
</style>
