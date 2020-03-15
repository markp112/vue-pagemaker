<template>
  <div class="flex justify-center items-center flex-row h-auto mt-32">
    <form @submit.prevent="submitClick" class="flex-2 border-2 rounded-md p-5 text-left mb-64 w-1/3" >
      <p class="text-center text-lg font-bold ">Login</p>
      <label for="email" class="text-sm">E-Mail</label>
      <input type="email"
            id="email"
            v-model="email"
            class="input-control"
            placeholder="E-mail address"
            required
      >
      <label for="password" class="text-sm mt-4 block">Password</label>
      <input type="password"
            id="password"
            v-model="password"
            class="input-control"
            placeholder="Password"
            required
      >
      <div class="flex justify-between flex-row mt-4">
        <button type="button" class="bg-gray-600 py-1 px-3 rounded-md text-white" click="cancelClick()">Cancel</button>
        <button type="submit" class="bg-blue-600 py-1 px-3 rounded-md text-white" click="submitClick()">Submit</button>
      </div>
      <div class="error" v-if="formErrors.length > 0">
        <p v-for="error in formErrors" :key="error"> {{ error }} </p>
      </div>
      <div v-if="loginFailed" class="error">
        Invalid user name or password
      </div>
      </form>
  </div>

</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { UserInterface, initUser } from '@/models/user/user';
import { ErrorCodes } from '../../models/enums/errors/errors';

@Component
export default class Login extends Vue {
    email = '';
    password ='';
    formErrors: string[] = [];
    loginFailed = false;

    submitClick(): void {
      this.loginFailed = false;
      if (this.validateForm()) {
        const user: UserInterface = initUser ;
        user.email = this.email;
        user.password = this.password;
        this.$store.dispatch('login', user)
        .then (() => {
          this.$router.push("/sites");
        })
        .catch(err =>{
          if (err === ErrorCodes.LoginFailed) {
            this.formErrors =[];
            this.formErrors.push("Invalid user name or password")
          } else {
            this.formErrors = [];
            this.formErrors.push(err);
          }
        })
      }
      console.log("Exiting login", this.$store.getters.isUserLoggedIn)

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

