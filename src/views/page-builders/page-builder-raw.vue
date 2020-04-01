<template>
  <section>
    <p> {{title}} </p>
    <div :id="id" class="w-full bg-accent2 h-screen"
      ref="mainDiv"
      @dragover.prevent
      @drop.prevent="onDrop"
    >
      <slot />    
    </div>
  </section>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue'
import Component from 'vue-class-component'
import FormButton from '@/components/base/buttons/form-button.vue';
import NavbarEditor from '@/components/page-builder-elements/nav-bars/nav-bar/nav-bar.vue'
import { EditorComponents, EditorComponentInterface, EditorComponentTypes } from '../../models/editor-components/editor-components';
import { ComponentBuilder } from '@/classes/component-builder/component-builder'
@Component({
  props:{
    id: {default: ''}
  },
  components:{
    'form-button': FormButton,
    'nav-bar-editor': NavbarEditor,
  }

})
export default class PageBuilder extends Vue {
  name="pageBuilder"
  title!: string;

  created() {
    this.title = this.$route.params.title;
    this.$store.dispatch("toggleSidebar", true);
  }

  onDrop(event: DragEvent) {
    const componentBuilder = new ComponentBuilder();
    console.log("event=", event)
    if(this.$store.getters.dragDropEventHandled) { return }
    if(event) {
      const componentId = componentBuilder.getComponentID(event);
      console.log("componentId", componentId)
      const instance = componentBuilder.buildComponent(componentId);
      console.log('%c⧭', 'color: #f2ceb6', instance)
      if(instance){
        if(event.target) {
          (this.$refs.mainDiv as HTMLDivElement).appendChild(instance.$el);
          this.$store.dispatch('toggleDragDropEventHandled', true);
        }
      }
    }
  }
    
  getComponent(componentId: string){
    const component:EditorComponentInterface = this.$store.getters.sidebarElements.get(componentId);
    const componentType = component.type;
    console.log('%c%s', 'color: #00e600', componentId, EditorComponentTypes.navBar)
    switch(componentId) {
      case 'Navbar': {
        const componentClass = Vue.extend(NavbarEditor);
        const instance:NavbarEditor  = new componentClass({
          propsData: {$store: this.$store}
        });
        instance.$mount();
        return instance;
      }
    }
  }
}

</script>