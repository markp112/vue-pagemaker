<template>
  <section>
    <div class="flex flex-row justify-between ml-12 mt-8">
      <h2 class="page-heading">My Pages</h2>
      <create-new-button @onClick="createNewPage()"></create-new-button>
    </div>
      <ul class="flex flex-col justify-start mt-10">
        <div class="flex flex-row justify-evenly font-bold mb-4">
          <span class="w-1/12"></span>
          <span class="w-2/12">Name</span>
          <span class="w-2/12">Date Created</span>
          <span class="w-2/12">Last Edited</span>
          <span class="w-2/12">Active</span>
        </div>
        <li v-for="page in pageList" :key="page.name" class="">
          <div class="flex flex-row justify-start">
          <span class="hover:bg-secondary-100 hover:text-accent w-11/12 p-2 flex flex-row justify-evenly cursor-pointer rounded-md" @click="pageRowClick(page.name)">
            <span class="w-1/12">
              <font-awesome-icon v-if="page.icon.icon !== ''" :icon="page.icon.icon" :prefix="page.icon.prefix"></font-awesome-icon>
            </span>
            <span class="w-2/12">{{ page.name }}</span>
            <span class="w-2/12">{{ formatdate(page.created)  }}</span>
            <span class="w-2/12">{{ formatdate(page.edited) }}</span>
            <span class="w-2/12 self-start"><input type="checkbox" value="page.active" readonly /> </span>
            
          </span>
          <font-awesome-icon icon="pencil-alt" prefix="fas" class="w-1/12 ml-2 hover:text-accent cursor-pointer" @click="editPencilClick(page.name)"></font-awesome-icon>
          </div>
        </li>
      </ul>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import CreateNewButton from '@/components/base/buttons/create-new/create-new.vue'
import { Page } from '@/models/pages/pages';
import { dateFormat } from 'vue-filter-date-format';
import {TimeStamp } from '@/models/Types/generic-types';
@Component({
  components: {
    'create-new-button' : CreateNewButton,
  }
})
export default class PageList extends Vue {
  name = "pageList"
  siteId ='';

  formatdate(date: TimeStamp):string {
    const actualDate = new Date(date.seconds * 1000)
    return dateFormat(actualDate,'DD MMM YYYY');
  }

  editPencilClick(pageName: string ) {
    console.log('%c%s', 'color: #00bf00', pageName)
    this.$store.dispatch('updateCurrentPage',pageName);
    this.$router.push({name:'page-editor', params:{title:'Edit Page'}});
  }

  created() {
    this.siteId = this.$store.getters.getCurrentSiteId;
    this.$store.dispatch('loadPages');
  }

  createNewPage() {
    this.$router.push({ name:"page-editor", params:{ title: 'Create New Page' }});
  }

  get pageList(): Page[] {
    return this.$store.getters.pageList;
  }
}
</script>