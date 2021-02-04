<template>
  <div>
    <p class="text-center text-2xl font-bold">Page Maker Registration</p>
    <form @submit.prevent="submitClick" class="mt-20 w-4/6 ml-8" >
    
      <label for="email" class="text-sm">E-Mail</label>
      <input type="email"
            id="email"
            v-model="email"
            class="input-control"
            placeholder="E-mail address"
      >
      <label for="password" class="text-sm mt-4 block">Password</label>
      <input type="password"
            id="password"
            v-model="password"
            class="input-control"
            minlength="8"
            placeholder="Password (min 8 characters)"
      >
      <label for="confirm-password" class="text-sm">E-Mail</label>
      <input type="password"
            id="confirm-password"
            v-model="confirmPassword"
            class="input-control"
            placeholder="Confirm password"
      >
      <div class="flex justify-between flex-row mt-4">
        <button type="button" class="bg-gray-600 py-1 px-3 rounded-md text-white" click="cancelClick()" >Cancel</button>
        <button type="submit" class="bg-blue-600 py-1 px-3 rounded-md text-white" click="submitClick()">Submit</button>
      </div>
      <div class="bg-red-600 text-white w-full mt-2 rounded-md p-2 text-sm" v-if="formErrors.length > 0">
        <p v-for="error in formErrors" :key="error"> {{ error }} </p>
      </div>
      </form>
    
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { UserInterface, initUser } from '@/models/user/user';
import { AuthModule } from '@/store/auth/auth';

@Component
export default class RegisterForm extends Vue {
  name = 'register-form';
  email = '';
  password = '';
  confirmPassword = '';
  formErrors: string[] = [];

  submitClick() {
    if(this.formIsValid()) {
      const user: UserInterface = initUser ;
      user.email = this.email;
      user.password = this.password;
      AuthModule.registerUser(user)
      .then(user => {
        console.log("registered");
      })
    }
  }

  cancelClick() {
    this.$router.push("/");
  }

  formIsValid(): boolean {
    this.formErrors = [];
    if ( this.email.length === 0 ) {
      this.formErrors.push("Email is required");
    }

    if (!this.validEmail(this.email)) {
      this.formErrors.push("Please enter a valid email address");
    }

    if( this.password !== this.confirmPassword ) { 
      this.formErrors.push("Password and confirmation password are not the same");
    }
    return this.formErrors.length === 0
  }

  validEmail(email:string):boolean {
    const re = new RegExp('/^[a-zA-Z0-9.!#$%&*+/=?^_{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/');
    // return re.test(email);
    return true;
  }
}
</script>

<style lang="postcss">
  .input-control {
    @apply block border-2 rounded-md w-full p-1;
  }
</style>
