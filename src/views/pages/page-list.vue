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
          <span
            class="hover:bg-site-secondary-light hover:text-accent1 w-11/12 p-1 mt-1 flex flex-row justify-evenly cursor-pointer rounded-md"
            @click="pageRowClick(page.name)"
          >
            <span class="w-1/12">
              <font-awesome-icon
                v-if="page.icon.icon !== ''"
                :icon="page.icon.icon"
                :prefix="page.icon.prefix"
              >
              </font-awesome-icon>
            </span>
            <span class="w-2/12">
              {{ page.name }}
            </span>
            <span class="w-2/12">
              {{ page.created | dateFormat("DD MMM YYYY") }}
            </span>
            <span class="w-2/12">
              {{ page.edited | dateFormat("DD MMM YYYY") }}
            </span>
            <span class="w-2/12 self-start">
              <input type="checkbox" value="page.active" readonly />
            </span>
          </span>
          <img
            src="@/assets/icons/pencil-24.png"
            alt="Edit pencil"
            @click="editPencilClick(page.name)"
            class="w-8 hover:shadow-xl cursor-pointer"
          />
        </div>
      </li>
    </ul>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import CreateNewButton from "@/components/base/buttons/create-new/create-new.vue";
import { Page } from "@/models/pages/pages";
import { PagesModule } from "@/store/pages/pages";
import { SitesModule } from "@/store/sites/sites";

@Component({
  components: {
    "create-new-button": CreateNewButton
  }
})
export default class PageList extends Vue {
  name = "pageList";
  siteId = "";

  editPencilClick(pageName: string) {
    PagesModule.updateCurrentPage(pageName);
    this.$router.push({ name: "page-editor", params: { title: "Edit Page" } });
  }

  created() {
    this.siteId = SitesModule.getCurrentSiteId;
    // PagesModule.loadPages();
  }

  mounted() {
    PagesModule.loadPages();
  }

  createNewPage() {
    this.$router.push({
      name: "page-editor",
      params: {
        title: "Create New Page"
      }
    });
  }

  pageRowClick(pageName: string) {
    this.$router.push({
      name: "page-builder",
      params: {
        title: pageName
      }
    });
  }

  get pageList(): Page[] {
    return PagesModule.pageList;
  }
}
</script>
