<template>
  <section>
    <div class="flex flex-row justify-between ml-12 mt-8 text-accent1">
      <h2 class="page-heading">My Sites</h2>
      <create-new-button @onClick="createNewSite"></create-new-button>
    </div>
    <div class="ml-20 w-100 mt-20 text-lg">
      <ul class="flex flex-col justify-start  w-4/5">
        <p>
          <span class="list-heading">Site</span>
          <span class="list-heading">Created</span>
          <span class="list-heading">Last Published</span>
        </p>
        <li class=" hover:bg-accent2 rounded-md pl-3" v-for="site in sites" :key="site.siteId">
          <span class="list-item hover:text-accent cursor-pointer" @click="siteClicked(site.siteId)">{{ site.name }}</span>
          <span class="list-item text-sm">{{ site.created }}</span>
          <span class="list-item">{{ isPublished(site.published) }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>
    

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import NewSite from './new-site.vue';
import { Site } from '../../models/sites/site';
import { dateParse } from 'vue-filter-date-parse';
import CreateNewButton from '@/components/base/buttons/create-new/create-new.vue'

@Component({
  components :{
    'create-new-button' : CreateNewButton,
  }
})
export default class SitesList extends Vue {
  name = "SitesList" ;
  
  created() {
    this.$store.dispatch('getSites');
  }

  createNewSite(): void {
    this.$router.push('/newSite');
  }

  siteClicked(siteId: string) {
    this.$store.dispatch('updateCurrentSiteId', siteId);
    this.$router.push({name:"pageList", params: { id: siteId }});
  }

  isPublished(datePublished: string): string {
    if(datePublished === '' || datePublished === undefined){
      return 'unpublished';
    } else {
      return  datePublished;
    }
  }

  get sites(): Site[] {
    return this.$store.getters.getListofSites;
  }

  
}
</script>

<style lang="postcss" scoped>
  .list-heading {
    @apply font-bold  mr-20 mb-5 inline-block w-1/6;
  }

  .list-item {
    @apply mr-20 mb-2 w-1/6 inline-block;
  }
</style>