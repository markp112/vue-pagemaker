<template>
 <div class="flex flex-col justify-start mt-4 w-full">
    <component :is='settingsPage'></component>
 </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator';
import { SidebarModule } from '@/store/sidebar/sidebar';
import SiteDefaults from './pages/site-defaults/site-defaults.vue';
import ColourPalette from './pages/colour-palette/colour-palettes.vue';

@Component({
  components: {
    'site-settings': SiteDefaults,
    'colour-palette': ColourPalette,
  }
})
export default class SiteSettings extends Vue{

  mounted() {
    SidebarModule.setSidebarMenuTo('site-settings');
    SidebarModule.toggleSidebar(true);
  }

  get settingsPage(): string {
    return this.$store.getters.siteSettingsActivePage;
  }

}
</script>
