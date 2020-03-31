<template>
  <section>
    <div class="flex flex-row justify-between ml-12 mt-8 text-accent1">
      <h2 class="page-heading">My Sites</h2>
      <create-new-button @onClick="createNewSite"></create-new-button>
    </div>
    <ul class="flex flex-row justify-evenly w-full mt-20">
      <li class="rounded-md ml-3" v-for="site in sites" :key="site.siteId">
        <site-card :site="site"></site-card>
      </li>
    </ul>
    
  </section>
</template>
    

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import NewSite from './new-site.vue';
import { Site } from '../../models/sites/site';
import { dateParse } from 'vue-filter-date-parse';
import CreateNewButton from '@/components/base/buttons/create-new/create-new.vue';
import SiteCard from '@/components/base/cards/site-card/site-card.vue';

@Component({
  components :{
    'create-new-button' : CreateNewButton,
    'site-card': SiteCard,
  }
})
export default class SitesList extends Vue {
  name = "SitesList" ;
  
  created() {
    this.$store.dispatch('getSites');
    this.$store.dispatch('toggleSidebar', false);
  }

  createNewSite(): void {
    this.$router.push({name:'newSite', params:{title: 'New Site'}});
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
