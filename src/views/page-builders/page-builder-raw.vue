<template>
  <section>
    <p class="page-heading">Editing: {{ title }} Page</p>
    <div
      :id="id-root"
      class="w-full h-auto relative p-4 border border-gray-400"
      :class="getClass()"
      ref="mainDiv"
      @dragover.prevent="bgColour = 'bg-gray-600'"
      @dragleave.prevent="bgColour = 'bg-gray-200'"
      @drop.prevent="onDrop"
    >
      <component
        v-for="(component, i) in layoutElements"
        :is="component.componentHTMLTag"
        :key="i"
        :index="i"
        :thisComponent="component"
        z-index="0"
        @dragover.prevent
        @drop.prevent="onDrop"
      >
      </component>
      <edit-delete-option @deleteClicked="deleteClicked()"></edit-delete-option>
      <transition>
        <text-editor
          class="absolute bg-gray-200 w-full top-0 left-0 h-full"
          v-if="showTextModal"
          :content="editedComponentText"
        >
        </text-editor>
      </transition>
    </div>
    
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Container from '@/components/page-builder-elements/generic/container.vue';
import { PageData } from '@/models/page/page';
// import { ComponentBuilder } from '@/classes/component-builder/component-builder';
import EditDeleteOption from '@/components/page-builder-elements/utility/edit-delete-options/edit-delete-options.vue';
import { PageModule } from '@/store/page/page';
import { SidebarModule } from '@/store/sidebar/sidebar';
import { ServicesModule } from '@/store/services/services';
import { ComponentCounter } from '@/classes/component-counter/singleton-counter';
import TextEditor from '@/components/base/text/text-editor/text-editor.vue';
import { ComponentContainer } from '@/classes/page-element/ComponentContainer';
// import { PageElementBuilder } from '@/classes/page-element/PageElementBuilder';
import { PageElementClasses, PageElementFactory } from '@/classes/page-element/factory/page-element-factory';
import { ComponentDefinitionInterface, initComponentDefinition } from '@/models/components/base-component';

// import { ComponentContainer, PageElementBuilder } from '@/classes/settings/page-element/PageElement';

const PARENT = 'ROOT';
// const PARENTCOMPONENT = new ComponentContainer(new PageElementBuilder());
// PARENTCOMPONENT.ref = PARENT;

@Component({
  props: {
    id: { default: '' },
  },
  components: {
    'edit-delete-option': EditDeleteOption,
    'text-editor': TextEditor,
    container: Container,
  },
})
export default class PageBuilder extends Vue {
  name = 'page-builder';
  title!: string;
  bgColour = 'bg-gray-200';
  showModal = false;
  private componentCounter: ComponentCounter = ComponentCounter.getInstance();
  private componentFactory: PageElementFactory = new PageElementFactory();
  private component:ComponentDefinitionInterface = initComponentDefinition;
  private rootComponent: ComponentContainer = this.componentFactory.createElement(
    'rootContainer',
    this.component,
    PARENT,
    null
  ) as ComponentContainer;


  created() {
    this.title = this.$route.params.title;
    SidebarModule.setSidebarMenuTo('sidebar-components');
  }

  get layoutElements(): PageElementClasses[] {
    return PageModule.pageElements;
  }

  onDrop(event: DragEvent): void {
    console.log('%c%s', 'color: #731d6d', 'onDrop')
    // const componentBuilder = new ComponentBuilder();
    if (ServicesModule.dragDropEventHandled) {
      return;
    }
    if (event) {
      const componentName = this.getComponentName(event);
      const component = SidebarModule.getComponentDefinition(componentName);
      console.log('%c⧭', 'color: #997326', component)
      const id = this.componentCounter.getNextCounter();
      const ref = `${componentName}::${id}`;
      if (component) {
        // const newComponent: PageData = componentBuilder.buildComponent(
        //   component,
        //   ref,
        //   PARENTCOMPONENT
        // );
        const pageElement = this.componentFactory.createElement(
          component.type,
          component,
          ref,
          this.rootComponent
        )
          console.log('%c⧭', 'color: #bfffc8', pageElement)
        // PageModule.addNewPageElement(newComponent);
        PageModule.addNewPageElement(pageElement);
      }
    }
  }
  
  getComponentName (event: DragEvent): string {
    const dataTransfer = event.dataTransfer;
    return dataTransfer ? dataTransfer.getData('text') : '';
  }

  deleteClicked(): void {
    PageModule.deletePageElement;
  }

  getClass(): string {
    return this.bgColour;
  }

  get showTextModal(): boolean {
    return this.$store.getters.showTextModal;
  }

  get editedComponentText(): string {
    return PageModule.editComponentData;
  }
}
</script>
