<template>
  <div class="form-page-wrapper mt-24 w-full flex-wrap">
    <div class="w-7/12 bg-secondary-100 text-accent1 text-3xl flex flex-row">
      <img src="@/assets/images/website-building.png" alt="picture of lined paper" >
      <p class="mt-4">{{ pageTitle }}</p>
    </div>  
      <form @submit.prevent="saveClicked"  class="w-7/12 border-2 p-5 bg-secondary-900">
        <div class="field-wrapper">
          <label for="name" >Site Name:</label>
          <input type="text" name="name" id="name" v-model="site.name"  placeholder="The name of your site" required/>
        </div>
        <div class="field-wrapper">
          <label for="description" >Description</label>
          <textarea rows="4" name="name" id="name" v-model="site.description" placeholder="Description of your site"></textarea>
        </div>
        <div class="field-wrapper h-32">
          <label for="image">Site Image</label>
          <image-uploader class="w-10/12 mt-4 mb-2" v-on:image-url="updateImageUrl"></image-uploader>
        </div>
        <div class="field-wrapper">
          <label for="created">Created:</label>
          <input type="date" name="created" id="created" v-model="site.created" />
        </div>
        <div class="field-wrapper">
          <label for="Url">Url:</label>
          <input type="text" name="Url" id="url" v-model="site.url" placeholder="url for website" />
          
        </div>
        <div class="field-wrapper">
          <label for="published">Published:</label>
          <input type="date" name="published" id="published" v-model="site.published" placeholder="url for website" />
        </div>
        <div class="field-wrapper">
          <label for="host-repo">Host URL:</label>
          <input type="text" name="host-repo" id="host-repo" v-model="site.hostRepo" placeholder="url for website" />
          
        </div>
        <div class="flex justify-between flex-row mt-8">
          <FormButton label="Cancel" v-on:onClick="cancelClicked()"></FormButton>
          <FormButton label="Save" v-on:onClick="saveClicked()"></FormButton>
        </div>
        <invalid-form :formErrors="formErrors"></invalid-form>
    </form>
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
import UploadImage from '@/components/base/pickers/upload-image/upload-image.vue';

@Component({
  components: {
    FormButton,
    'invalid-form': InvalidForm,
    'image-uploader': UploadImage,
  }

})
export default class NewSite extends Vue {
  name = "NewSite";
  site: Site = initSite;
  formErrors!: string[];
  pageTitle!:  string;

  created() {
    this.formErrors = [];
    this.pageTitle = this.$route.params.title;
    const siteId = this.$store.getters.getCurrentSiteId;
    if(siteId !== undefined  && siteId !== '' ) {
      this.site = this.$store.getters.getCurrentSite;
    }
  }

  updateImageUrl(url: string):void {
    console.log("Update Image called", url)
    this.site.image = url;
  }


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
  @apply text-sm self-start inline-block w-2/12;
}

input, textarea {
  @apply w-10/12 border-solid border bg-accent2 self-end;
}

.field-wrapper {
  @apply flex flex-row justify-start mb-2  ml-1;
}
</style>