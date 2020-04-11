<template>
  <div class="border-r-4 p-0  md:h-sidebar ml-2">
     <component :is="sidebarContent"></component>
  </div>
</template>

<script lang="ts">

import Component from 'vue-class-component';
import { Emit, Vue } from 'vue-property-decorator';
import sidebarComponentIcons from './sidebar-component-icons.vue';
import ImageEditorSidebar from '@/components//core/sidebar/image-editor/image-editor.vue'
@Component({
  components:{
    'sidebar-components' : sidebarComponentIcons,
    'image-editor' : ImageEditorSidebar,
  }
})
export default class SideBar extends Vue {
  isShowSideBar = true;

  get showSidebar(): boolean {
    return this.$store.getters.showSidebar;
  }

  get sidebarContent(): string {
    return this.$store.getters.sidebarComponentType;
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
    @apply shadow  shadow-xl -translate-x-1 -translate-y-1;
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