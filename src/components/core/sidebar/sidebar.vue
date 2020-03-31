<template>
  <div class="border-r-4 p-0 fixed bottom-0 md:left-0 md:h-sidebar ml-2 mb-2 mt-2 w-1/5">
      <ul class='icon-list-sidebar'>
        <li v-for="element in sidebarElements" :key="element.name" >
          <draggable-icon draggable="true" :id="element.name">
          <font-awesome-icon :icon='element.icon.icon' 
            :prefix='element.icon.prefix' 
            class="icon" 
            />

          </draggable-icon>
        </li>
      </ul>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { Emit, Vue } from 'vue-property-decorator';
import { EditorComponentInterface, EditorComponents } from '../../../models/editor-components/editor-components';
import  DraggableIcon from '@/components/base/draggable/draggable-icon/draggable-icon.vue';
@Component({
  components:{
    'draggable-icon': DraggableIcon,
  }
})
export default class SideBar extends Vue {
  isShowSideBar = true;

  created() {
    this.$store.dispatch('loadSideBarElements');
  }

  // iconDrag(event: DragEvent) {
  // if(event.dataTransfer ) {
  //   event.dataTransfer.setData("text", '1');
  // }
  //   // event.dataTransfer.setData("text", event.target.id)
  // }

  get sidebarElements(): EditorComponentInterface[] {
    const editorComponent:EditorComponents = this.$store.getters.sidebarElements
    return  editorComponent.editorComponents;
  }

  get showSidebar(): boolean {
    console.log("this.$store.getters.showSidebar",this.$store.getters.showSidebar)
    return this.$store.getters.showSidebar;
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