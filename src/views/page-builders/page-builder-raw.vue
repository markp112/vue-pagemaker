<template>
  <section>
    <p class="page-heading">Editing: {{title}} Page</p>
    <div :id="id" class="w-full bg-accent2 h-full relative p-2 border border-gray-400"
      ref="mainDiv"
      @dragover.prevent
      @drop.prevent="onDrop"
    >
    <component :is="layout.component" v-for="(layout,i) in layoutElements"
      :key="i"
      :index="i" 
      :thisComponent="layout"
      class="border-red-500 bg-red-600 p-4"
      z-index = "0"
      @dragover.prevent
      @drop.prevent="onDrop"
      >
    </component>
    
      <edit-delete-option  @deleteClicked="deleteClicked()" ></edit-delete-option> 
    </div>
  </section>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue'
import Component from 'vue-class-component'
import FormButton from '@/components/base/buttons/form-button.vue';
import NavbarEditor from '@/components/page-builder-elements/nav-bars/nav-bar/nav-bar.vue'
import { PageData } from '@/models/page/page';
import { EditorComponents, EditorComponentInterface, EditorComponentTypes } from '../../models/editor-components/editor-components';
import { ComponentBuilder } from '@/classes/component-builder/component-builder';
import EditDeleteOption from '@/components/page-builder-elements/utility/edit-delete-options/edit-delete-options.vue';


@Component({
  props:{
    id: {default: ''}
  },
  components:{
    'form-button': FormButton,
    'nav-bar-editor': NavbarEditor,
    'edit-delete-option': EditDeleteOption,
  }

})
export default class PageBuilder extends Vue {
  name="pageBuilder"
  title!: string;

  created() {
    this.title = this.$route.params.title;
    this.$store.dispatch("toggleSidebar", true);
  }

  get layoutElements():PageData [] {
    return this.$store.getters.pageElements
  }

  onDrop(event: DragEvent) {
    const componentBuilder = new ComponentBuilder();
    console.log("event=", event)
    if(this.$store.getters.dragDropEventHandled) { return }
    if(event) {
      const componentId = componentBuilder.getComponentID(event);
      const ref = `${componentId}::${this.$store.getters.nextComponentId}`;
      console.log('%c%s', 'color: #e50000', ref)

      const newComponent: PageData = componentBuilder.buildComponent(componentId, ref, 'ROOT');
      this.$store.dispatch('addNewPageElement', newComponent);
    }
  }
  
  deleteClicked() {
    this.$store.dispatch('deletePageElement')
  }
}

</script>