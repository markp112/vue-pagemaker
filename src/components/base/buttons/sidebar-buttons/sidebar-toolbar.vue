<template>
  <section class="sidebar-button-panel mt-2">
    <h4 class="text-siteSurface">{{ $props.toolbarTitle }}</h4>
    <div
      v-for="toolbarItem in $props.toolbarItems.toolbarIcons"
      :key="toolbarItem.className"
      class="m-2"
    >
      <div class="relative">
        <img
          :src="getPath(toolbarItem.icon)"
          class="cursor-pointer  hover:bg-secondary-100 w-12"
          @click="iconClick(toolbarItem.className)"
          @mouseover="showToolTip = toolbarItem.className"
          @mouseleave="showToolTip = ''"
        />
        <tooltip
          :tooltip="toolbarItem.toolTip"
          :showToolTip="getShowToolTip(toolbarItem.className)"
        ></tooltip>
      </div>
    </div>
  </section>
</template>

<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';
import ToolTip from '@/components/base/notifications/tooltip/tooltip.vue';
import { Emit } from 'vue-property-decorator';
import { SidebarToolbar } from '@/models/sidebar/button-definition/sidebar-buttons';

@Component({
  props: {
    toolbarItems: {
      default: (): SidebarToolbar => {
        return new SidebarToolbar();
      }
    },
    toolbarTitle: { default: '' }
  },
  components: {
    tooltip: ToolTip
  }
})
export default class SidebarToolbarScreen extends Vue {
  name = 'SidebarToolbarScreen';
  showToolTip = '';

  @Emit('iconClick')
  iconClick($event: string) {
    return $event;
  }

  getPath(image: string): string {
    const path = require.context('@/assets/icons', false, /\.png$/);
    return path(`./${image}`);
  }

  get getShowToolTip(): (classDef: string) => boolean {
    return (classDef: string) => this.showToolTip === classDef;
  }
}
</script>
