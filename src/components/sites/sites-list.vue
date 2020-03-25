<template>
  <section>
    <div class="flex flex-row justify-between ml-12 mt-8 text-accent1">
      <h2 class="text-3xl font-bold ">My Sites</h2>
      <p class="mr-12 mt-2 font-medium">Create New
          <font-awesome-icon v-
            icon='plus-circle' 
            prefix="fas" 
            class="text-accent icon-size ml-3 mr-12 cursor-pointer hover:text-accent" 
            @click="createNewSite()" />
      </p>
    </div>

    <div class="ml-20 w-100 mt-20 text-lg">
      <ul class="flex flex-col justify-start  w-4/5">
        <p>
          <span class="list-heading">Site</span>
          <span class="list-heading">Created</span>
          <span class="list-heading">Last Published</span>
        </p>
        <li class=" hover:bg-accent2 rounded-md pl-3" v-for="site in sites" :key="site.siteId">
          <span class="list-item hover:text-accent cursor-pointer">{{ site.name }}</span>
          <span class="list-item text-sm">{{ site.created | dateParse('YYYY.MM.DD') | dateFormat('DD MMM YYYY') }}</span>
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

@Component
export default class SitesList extends Vue {
  name = "SitesList" ;
  
  created() {
    this.$store.dispatch('getSites');
  }

  createNewSite(): void {
    this.$router.push('/newSite');
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