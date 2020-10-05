<template>
  <div class="p-0 h-sidebar">
    <component :is="sidebarContent" :toolbarPanel="sidebarPanel"></component>
  </div>
</template>

<script lang="ts">

import Component from 'vue-class-component';
import { Emit, Vue } from 'vue-property-decorator';
import sidebarComponentIcons from './sidebar-component-icons.vue';
import ImageEditorSidebar from '@/components/core/sidebar/image-editor/image-editor.vue';
import SidebarPanelSiteSettings  from '@/views/settings/core/sidebar/sidebar-panel.vue';
import TextEditorSidebar from '@/components/core/sidebar/text-editor//text-editor.vue';
import ButtonEditor from '@/components/core/sidebar/button-editor/button-editor.vue';
import SitesMenu from '@/components/core/sidebar/sites-menu/sites-menu.vue'
import SidebarPanelScreen from '@/components/base/buttons/sidebar-buttons/sidebar-panel.vue';
import { SidebarPanelBuilder, SidebarComponents } from '@/classes/sidebar-toolbar/sidebar-toolbar-buidler';
import { SidebarModule } from '@/store/sidebar/sidebar';
import { SidebarPanel } from '../../../models/sidebar/button-definition/sidebar-buttons';


@Component({
  components: {
    'sidebar-components': sidebarComponentIcons,
    'sites-menu' : SitesMenu,
    'image-editor': ImageEditorSidebar,
    'text-editor': TextEditorSidebar,
    'container-editor': SidebarPanelScreen,
    'button-editor': ButtonEditor,
    'site-settings': SidebarPanelSiteSettings,
  }
})
export default class SideBar extends Vue {
  isShowSideBar = true;
  sidebarPanelBuilder: SidebarPanelBuilder = new SidebarPanelBuilder('container-editor');

  get showSidebar(): boolean {
    return SidebarModule.showSidebar;
  }

  get sidebarContent(): SidebarComponents {
    return SidebarModule.sidebarComponentType;
  }

  get sidebarPanel(): SidebarPanel {
    const panelType: SidebarComponents = SidebarModule.sidebarComponentType;
    return panelType !== 'site-settings' ? new SidebarPanelBuilder('container-editor').sidebarPanel : new SidebarPanelBuilder('site-settings').sidebarPanel ;
  }
}
</script>

<style lang="postcss" >

  .icon-list-sidebar {
    @apply flex flex-row flex-wrap text-4xl justify-evenly mt-32 w-full ;
  }

  .icon {
    @apply transform cursor-pointer;
  }

  .icon:hover {
    @apply shadow-xl -translate-x-1 -translate-y-1;
  }

  @screen md {
  .side-bar-show {
    @apply w-1/5;
  }

  .side-bar-hidden {
    @apply w-1/12;
  }
}
</style>
