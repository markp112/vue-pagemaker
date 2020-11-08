<template>
  <div class="sidebar-panel">
    <p class="flex flex-row justify-between text-siteSurface mb-2">
      Save Page
      <img
      :src="getPath('floppy_disk-32.png')"
      class="text-accent-600 cursor-pointer hover:bg-gray-600"
      @click="onSaveClick()"
    /></p>
    <p class=" mt-3 text-lg">Containers</p>
      <ul class='flex flex-row flex-wrap text-4xl justify-evenly w-full mt-4 ml-2 mr-2'>
        <li v-for="element in sidebarContainers" :key="element.componentName" >
          <draggable-icon draggable="true" :id="element.componentName">
            <icon-image :icon = "element.sidebarIcon" classDef="icon" :id="element.componentName"></icon-image>
          </draggable-icon>
        </li>
      </ul>
      <p class="mt-3 text-lg">Elements</p>
      <ul class='flex flex-row flex-wrap text-4xl justify-evenly w-full mt-4 ml-2 mr-2'>
        <li v-for="element in sidebarElements" :key="element.componentName" >
          <draggable-icon draggable="true" :id="element.componentName">
            <icon-image :icon = "element.sidebarIcon" classDef="icon" :id="element.componentName"></icon-image>
          </draggable-icon>
        </li>
      </ul>
    </div>
</template>

<script lang="ts">

import Vue from 'vue';
import  DraggableIcon from '@/components/base/draggable/draggable-icon/draggable-icon.vue';
import { ComponentDefinitionInterface, initComponentDefinition } from '@/models/components/base-component';
import Component from 'vue-class-component';
import { SidebarModule } from '@/store//sidebar/sidebar';
import IconImage from '@/components/base/icon-image/icon-image.vue';
import { SiteIdAndUserId } from '@/models/site-and-user/site-and-user';
import { SnackbarMixin } from '@/mixins/components/snackbar/snackbar-mixin';
import { Notification } from '@/models/notifications/notifications';

@Component({
  components:{
    'draggable-icon': DraggableIcon,
    'icon-image': IconImage,
  }
})
export default class SidebarComponentIcons extends SnackbarMixin {

  created() {
    SidebarModule.loadSideBarElements();
  }

  onSaveClick() {
    const SiteIdAndUserId: SiteIdAndUserId = this.getSiteAndUserID();
    this.$store.dispatch("savePageContent", SiteIdAndUserId)
    .then (notification => {
      this.showSnackbar(notification, "Page Saved");
    })
    .catch((err: Notification) => {
      console.log(err);
      err.message = "There was an issue with saving the page";
      this.showSnackbar(err, "Page save failed");
    })
  }

  get sidebarContainers(): ComponentDefinitionInterface[] {
    return  SidebarModule.getSidebarContainers;
  }

  get sidebarElements(): ComponentDefinitionInterface[] {
    return  SidebarModule.getSidebarElements;
  }

  private getPath(image: string): string {
    const path = require.context('@/assets/icons',false,/\.png$/);
    return path(`./${image}`);
  }

  private getSiteAndUserID(): SiteIdAndUserId {
    return {
      siteId: this.$store.getters.getCurrentSiteId,
      userId: this.$store.getters.currentUser.id,
    };
  }
}
</script>

<style lang="postcss" scoped>

.icon-list-sidebar {
  @apply flex flex-row flex-wrap text-4xl justify-evenly w-full ;
}

.icon {
  @apply transform cursor-pointer mr-2;
}

.icon:hover {
  @apply shadow-xl -translate-x-1 -translate-y-1;
}

</style>
