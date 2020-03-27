<template>
  <div class="flex flex-row justify-between ml-12 mt-8">
    <h2 class="page-heading">My Pages</h2>
    <create-new-button @onClick="createNewPage()"></create-new-button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import CreateNewButton from '@/components/base/buttons/create-new/create-new.vue'

@Component({
  components: {
    'create-new-button' : CreateNewButton,
  }
})
export default class PageList extends Vue {
  name = "pageList"
  siteId ='';

  created() {
    console.log('Siteid',this.$route.params.id);
    this.siteId = this.$route.params.id;
  }

  createNewPage() {
    this.$router.push({ name:"page-editor", params:{ title: 'Create New Page' }});
  }

}
</script>