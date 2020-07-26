<template>
  <div class="bg-secondary-800 h-full p-1">
    <p class="text-gray-500 mt-3">Containers</p>
      <ul class='flex flex-row flex-wrap text-4xl justify-evenly w-full mt-4 ml-2 mr-2'>
        <li v-for="element in sidebarContainers" :key="element.componentName" >
          <draggable-icon draggable="true" :id="element.componentName">
            <icon-image :icon = "element.sidebarIcon" classDef="icon" :id="element.componentName"></icon-image>
          </draggable-icon>
        </li>
      </ul>
      <p class="text-gray-500 mt-3 text-lg">Elements</p>
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

@Component({
  components:{
    'draggable-icon': DraggableIcon,
    'icon-image': IconImage,
  }
})
export default class SidebarComponentIcons extends Vue {

  created() {
    SidebarModule.loadSideBarElements();
  }

  get sidebarContainers(): ComponentDefinitionInterface[] {
    return  SidebarModule.getSidebarContainers;
  }

  get sidebarElements(): ComponentDefinitionInterface[] {
    return  SidebarModule.getSidebarElements;
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
