<template>
      <ul class='flex flex-row flex-wrap text-4xl justify-evenly w-full mt-4'>
        <li v-for="element in sidebarElements" :key="element.componentName" >
          <draggable-icon draggable="true" :id="element.componentName">
            <font-awesome-icon :icon='element.sidebarIcon.icon' 
              :prefix='element.sidebarIcon.prefix' 
              class="icon" 
              />
          </draggable-icon>
        </li>
      </ul>
</template>

<script lang="ts">

import Vue from 'vue'
import  DraggableIcon from '@/components/base/draggable/draggable-icon/draggable-icon.vue';
import { ComponentDefinitionInterface, ComponentDefinitions} from '@/models/page/page'
import Component from 'vue-class-component';

@Component({
  components:{
    'draggable-icon': DraggableIcon,
  }
})
export default class SidebarComponentIcons extends Vue {

  created() {
    this.$store.dispatch('loadSideBarElements')
  }

  get sidebarElements(): ComponentDefinitionInterface[] {
    return  this.$store.getters.sidebarElements;
  }
}
</script>

<style lang="postcss" scoped>

  .icon-list-sidebar {
    @apply flex flex-row flex-wrap text-4xl justify-evenly w-full ;
  }

  .icon {
    @apply transform cursor-pointer;
  }

  .icon:hover {
    @apply shadow  shadow-xl -translate-x-1 -translate-y-1;
  }

</style>