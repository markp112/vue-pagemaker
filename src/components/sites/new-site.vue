<template>
  <div class="w-100">
      <p class="text-2xl font-bold ml-10 mb-4 mt-10">
          Create New Site
      </p>
      <div class="mt-16 flex flex-row justify-center">
      <form @submit.prevent="saveClicked"  class="ml-20 flex flex-col justify-evenly border-2 rounded-md shadow-lg shadow p-5 w-6/12">
      
        <label for="name">Site Name:</label>
        <input type="text" name="name" id="name" v-model="site.name"  placeholder="The name of your site" required/>
        <label for="description" >Description</label>
        <textarea rows="4" name="name" id="name" v-model="site.description" placeholder="Description of your site"></textarea>
        <label for="created">Created:</label>
        <input type="date" name="created" id="created" v-model="site.created" />
        <label for="Url">Url:</label>
        <input type="text" name="Url" id="url" v-model="site.url" placeholder="url for website" />
        <label for="published">Published:</label>
        <input type="date" name="published" id="published" v-model="site.published" placeholder="url for website" />
        <label for="host-repo">Host URL:</label>
        <input type="text" name="host-repo" id="host-repo" v-model="site.hostRepo" placeholder="url for website" />
        <div class="flex justify-between flex-row mt-8">
          <FormButton label="Cancel" v-on:onClick="cancelClicked()"></FormButton>
          <FormButton label="Save" v-on:onClick="saveClicked()"></FormButton>
        </div>
        <invalid-form :formErrors="formErrors"></invalid-form>
    </form>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from "vue-class-component";
import { Emit } from 'vue-property-decorator';
import { Site, initSite } from '../../models/sites/site';
import FormButton  from '@/components/base/buttons/form-button.vue';
import InvalidForm from '@/components/base/notifications/invalid-form.vue';
import { SnackbarMessage, SnackbarTypes, SnackBarGenerator } from '@/models/notifications/snackbar';

@Component({
  components: {
    FormButton,
    'invalid-form': InvalidForm,
  }

})
export default class NewSite extends Vue {
  name = "NewSite";
  site: Site = initSite;
  formErrors: string[] = [];

  cancelClicked() {
    this.$router.push("/sites");
  }

  saveClicked() {
    this.formErrors = [];
    const errors: string[] = this.validateForm();
    if (errors.length === 0) {
      this.$store.dispatch("saveSite", this.site)
      .then((result: Notification) => {
        const snackbarMessage: SnackbarMessage = SnackBarGenerator.snackbarSuccess(`The site ${this.site.name} has been created`,'Site Record Saved')
      
        this.$store.dispatch('showSnackbar',snackbarMessage);
      })
    } else {
      this.formErrors = errors;
    }
  }

  validateForm(): string[] {
    const errors:string[] = [];
    if(this.site.name.length < 5) {
      errors.push("Site name must be more than 5 characters");
    }

    return errors;
  }

}

</script >

<style lang="postcss">

label {
  @apply text-sm self-start mb-1 mt-2 ml-1 block;
}

input, textarea {
  @apply w-full border-solid border bg-accent2 block;
}

</style>