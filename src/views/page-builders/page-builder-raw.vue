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
      class="border-red-500 bg-red-600 p-4"
      z-index = "0"
      >

    </component>
      <slot />   
      <edit-delete-option  @deleteClicked="deleteClicked()" ></edit-delete-option> 
    </div>
  </section>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue'
import Component from 'vue-class-component'
import FormButton from '@/components/base/buttons/form-button.vue';
import NavbarEditor from '@/components/page-builder-elements/nav-bars/nav-bar/nav-bar.vue'
import { EditorComponents, EditorComponentInterface, EditorComponentTypes } from '../../models/editor-components/editor-components';
import { ComponentBuilder } from '@/classes/component-builder/component-builder';
import EditDeleteOption from '@/components/page-builder-elements/utility/edit-delete-options/edit-delete-options.vue';
import { PageData } from '../../models/page/page';

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
      console.log("componentId", componentId)
      const newComponent:PageData = componentBuilder.buildComponent(componentId,'test1' )
      this.$store.dispatch('addNewPageElement', newComponent)

      // const instance = componentBuilder.buildComponent(componentId);
      // console.log('%c⧭', 'color: #f2ceb6', instance)
      // if(instance){
      //   if(event.target) {
      //     (this.$refs.mainDiv as HTMLDivElement).appendChild(instance.$el);
      //     this.$store.dispatch('toggleDragDropEventHandled', true);
      //     const element = {template:'nav-bar-editor'}
      //     this.layoutElements.push(element)
      //   }
      // }
    }
  }
  // }
    
  // getComponent(componentId: string){
  //   const component:EditorComponentInterface = this.$store.getters.sidebarElements.get(componentId);
  //   const componentType = component.type;
  //   console.log('%c%s', 'color: #00e600', componentId, EditorComponentTypes.navBar)
  //   switch(componentId) {
  //     case 'Navbar': {
  //       const componentClass = Vue.extend(NavbarEditor);
  //       const instance:NavbarEditor  = new componentClass({
  //         propsData: {$store: this.$store}
  //       });
  //       instance.$mount();
  //       return instance;
  //     }
  //   }
  // }

  deleteClicked() {
    const component = this.$store.getters.editedComponentRef;
    // (this.$refs.mainDiv as HTMLDivElement).removeChild()
    console.log('%c⧭', 'color: #f2ceb6', this.$refs.mainDiv)

    
  }
}

</script>