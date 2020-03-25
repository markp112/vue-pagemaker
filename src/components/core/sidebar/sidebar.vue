<template>

  <div class="border-r-4 p-0 fixed bottom-0 md:left-0 md:h-sidebar w-1/6 ml-2 mb-2 mt-2">

      <ul class='w-full icon-list mt-32'>
        <li v-for="element in sidebarElements" :key="element.name">
         <font-awesome-icon :icon='element.icon' 
            :prefix='element.iconPrefix' 
            class="icon" 
            draggable="true" 
            @dragstart="iconDrag(event)"
            :id="element.name" />
        </li>
      </ul>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Emit, Vue } from 'vue-property-decorator';
import { EditorComponentInterface, EditorComponents } from '../../../models/editor-components/editor-components';

@Component
export default class SideBar extends Vue {
  isShowSideBar = true;

  created() {
    this.$store.dispatch('loadSideBarElements');
  }

  iconDrag(event: DragEvent) {
    console.log(event)
  if(event.dataTransfer ) {

    event.dataTransfer.setData("text", '1');
  }
    // event.dataTransfer.setData("text", event.target.id)
  }

  get sidebarElements(): EditorComponentInterface[] {

    console.log('%c⧭', 'color: #f2ceb6', this.$store.getters.sidebarElements._editorComponents)
    return  this.$store.getters.sidebarElements._editorComponents;
}
}
</script>

<style lang="postcss">
  .icon-list {
    @apply flex flex-row flex-wrap text-4xl justify-evenly;
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