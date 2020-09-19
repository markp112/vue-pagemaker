<template>
 <div class="flex flex-col justify-start mt-4 w-full">
    <div class="text-primary-800 text-3xl mb-8">
      Site Settings
    </div>
    <component :is='settingsPage'></component>
 </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator';
import { SidebarModule } from '@/store/sidebar/sidebar';
import SiteDefaults from './pages/site-defaults/site-defaults.vue'
@Component({
  components: {
    'site-defaults': SiteDefaults,
  }
})
export default class SiteSettings extends Vue{
  settingsPage ='site-defaults';


  mounted() {
    SidebarModule.setSidebarMenuTo('site-settings');
    SidebarModule.toggleSidebar(true);

  }


}
</script>