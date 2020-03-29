<template>
  <section>
    <div class="flex flex-row justify-between ml-12 mt-8">
      <h2 class="page-heading">My Pages</h2>
      <create-new-button @onClick="createNewPage()"></create-new-button>
    </div>
      <ul class="flex flex-col justify-start">
        <div>
          <span>Name</span>
          <span>Date Created</span>
          <span>Last Edited</span>
        </div>
        <li v-for="page in pageList" :key="page.name" class="flex flex-row justify-evenly">
          <font-awesome-icon v-if="page.icon.icon !== ''" :icon="page.icon.icon" :prefix="page.icon.prefix"></font-awesome-icon>
          <span>{{page.name}}</span>
          <span>{{ page.created) }}</span>
          <span>{{ page.edited}}</span>
          <span><input type="checkbox" value="page.active" readonly /> </span>
        </li>
      </ul>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import CreateNewButton from '@/components/base/buttons/create-new/create-new.vue'
import { Page } from '@/models/pages/pages';

@Component({
  components: {
    'create-new-button' : CreateNewButton,
  }
})
export default class PageList extends Vue {
  name = "pageList"
  siteId ='';

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