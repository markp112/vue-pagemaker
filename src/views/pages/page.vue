<template>
  <div class="form-page-wrapper mt-24 w-full flex-wrap">
    <div class="w-7/12 bg-secondary-100 text-accent1 text-3xl flex flex-row">
      <img src="@/assets/images/page-icon.png" alt="picture of lined paper" >
      <p class="mt-4">{{ pageTitle }}</p>
    </div>  
    <form  @submit.prevent="saveClick"  class="w-7/12 border-2 p-5 bg-secondary-900">
      <label for="page-name">Name:</label>
      <input type="text"
        id="page-name"
        v-model="page.name"
        class="input-control"
        placeholder="e.g Home, Blog Home and must be unique"
      >
      <label for="icon">Select Icon</label>
        <div>
          <span class="h-8 w-8 bg-accent1 text-center font-bold align-middle border cursor-pointer relative inline-block" @click="iconPickerClicked()">...</span>
            <span>
              <font-awesome-icon v-if="page.icon !==''" class="ml-2 inline-block text-lg align-middle"
              :icon="page.icon.icon" 
              :prefix="page.icon.prefix" name="icon">
              </font-awesome-icon>
            </span>
          <icon-picker @icon-clicked="iconClick" id="icon"></icon-picker>
        </div>
      <label for="created">Created:</label>
      <datepicker :value="page.created"   id="created" name="created"></datepicker> 
      <label for="edited">edited:</label>
      <p class="block border-2 rounded-md w-full p-1" id="edited">{{ page.edited }}</p>
      <div class="flex flex-row justify-start h-8">
        <label for="active">Active:</label>
        <input type="checkbox" name="active" id="active" :value="page.active" class="mt-5 w-1/12">
      </div>
      <submit-cancel v-on:cancelClicked="cancelClick()"  v-on:saveClicked="saveClick()" ></submit-cancel>
      <invalid-form :formErrors="formErrors"></invalid-form>
    </form>
  </div>

</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import { Page } from '@/models/pages/pages';
import IconPicker from '@/components/base/pickers/icon-picker/icon-picker.vue';
import { IconInterface } from '../../models/font-awesome/icon';
import InvalidForm from '@/components/base/notifications/invalid-form.vue';
import { Notification } from '@/models/notifications/notifications';
import { SnackbarMessage, SnackbarTypes, SnackBarGenerator } from '@/models/notifications/snackbar';
import SubmitCancel from '@/components/base/buttons/submit-cancel/submit-cancel.vue';
import FormButton  from '@/components/base/buttons/form-button.vue';
import {TimeStamp, formatDate, formatTimeStampAsDate } from '@/models/Types/generic-types';

@Component({
  components:{
    'icon-picker': IconPicker,
    'submit-cancel': SubmitCancel,
    'invalid-form': InvalidForm,
    FormButton,

  }
})
export default class PageEditor extends Vue {
  pageTitle!: string;
  page!: Page;
  formErrors!: string[];
  dateCreated!: Date;

  created() {
    this.pageTitle = this.$route.params.title;
    this.page = this.$store.getters.getCurrentPage;
    const DateTimeStamp:TimeStamp = {seconds: this.page.created.getSeconds(), nanoseconds:0};
    this.dateCreated = formatTimeStampAsDate(DateTimeStamp)
    this.formErrors = [];
  }

  iconPickerClicked() {
    this.$store.dispatch('toggleIconPicker', true)
  }

  iconClick(icon: IconInterface) {
    this.page.icon = icon
  }

  cancelClick() {
    const siteId = this.$store.getters.getCurrentSiteId;
    this.$router.push({ name:"pageList" });
  }

  saveClick(){
    this.formErrors = [];
    const errors: string[] = this.validateForm();
    if(errors.length === 0){
      this.page.edited = new Date();
      this.savePage();
    } else {
      this.formErrors = errors;
    }
  }

  validateForm(): string[] {
    const errors:string[] = [];
    if(this.page.name.length === 0) {
      errors.push("page name is required");
    }
    const pageList:Page[] = this.$store.getters.getPageList;
    if(pageList !== undefined) {
      if(pageList.filter(page => page.name === this.page.name )) {
        errors.push("Page name must be unique");
      }
    }
    return errors;
  }

  savePage(): void {
    this.$store.dispatch("saveThePage", this.page)
    .then(result  => {
        const notification = result as Notification;
        if(notification.status === "ok") {
          const snackbarMessage: SnackbarMessage = SnackBarGenerator.snackbarSuccess(`The ${this.page.name} page has been created`,'Page Saved')
          this.$store.dispatch('showSnackbar', snackbarMessage)
        } else {
          this.showErrorsnackbar(notification.message, "Error on Save")
        }
      })
    .catch( err => {
          this.showErrorsnackbar(err, "System Error")
      })
  }

  showErrorsnackbar(message: string, title: string ) {
      const snackbarMessage = SnackBarGenerator.snackbarError(message ,title)
      this.$store.dispatch('showSnackbar', snackbarMessage)
  }

}
</script>

<style lang="postcss">
  label {
    @apply text-sm mt-4;
  }

  .input-control {
    @apply block border-2 rounded-md w-full p-1;
}

</style>