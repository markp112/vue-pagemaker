<template>
  <div class="flex flex-row justify-between ml-12 mt-8">
    <h2 class="page-heading">My Pages</h2>
    <create-new-button @onClick="createNewPage()"></create-new-button>
    <ul>
      <li v-for="page in pageList" :key="page.name">
        <font-awesome-icon v-if="page.icon.icon !== ''" :icon="page.icon.icon" :prefix="page.icon.prefix"></font-awesome-icon>
        <span>{{page.name}}</span>
        <span>{{ page.created }}</span>
        <span>{{ page.edited}}</span>
        <span><input type="checkbox" value="page.active" readonly /> </span>
      </li>
    </ul>
  </div>
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
    console.log("Created called")
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