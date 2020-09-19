<template>
  <section>
    <p class="page-heading">Editing: {{ title }} Page</p>
    <div
      :id="id"
      class="w-full h-full relative p-4 border border-gray-400"
      :class="getClass()"
      ref="mainDiv"
      @dragover.prevent="bgColour = 'bg-gray-600'"
      @dragleave.prevent="bgColour = 'bg-gray-200'"
      @drop.prevent="onDrop"
    >
      <component
        :is="layout.componentHTMLTag"
        v-for="(layout, i) in layoutElements"
        :key="i"
        :index="i"
        :thisComponent="layout"
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
import {
  PageData,
  ComponentContainer,
  PageElementBuilder,
} from '@/models/page/page';
import { ComponentBuilder } from '@/classes/component-builder/component-builder';
import EditDeleteOption from '@/components/page-builder-elements/utility/edit-delete-options/edit-delete-options.vue';
import { PageModule } from '@/store/page/page';
import { SidebarModule } from '@/store/sidebar/sidebar';
import { ServicesModule } from '@/store/services/services';
import { ComponentCounter } from '@/classes/component-counter/singleton-counter';
import TextEditor from '@/components/base/text/text-editor/text-editor.vue';

const PARENT = 'ROOT';
const PARENTCOMPONENT = new ComponentContainer(new PageElementBuilder());

PARENTCOMPONENT.ref = PARENT;

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

  created() {
    this.title = this.$route.params.title;
    SidebarModule.setSidebarMenuTo('sidebar-components');
  }

  get layoutElements(): PageData[] {
    return PageModule.pageElements;
  }

  onDrop(event: DragEvent): void {
    const componentBuilder = new ComponentBuilder();
    if (ServicesModule.dragDropEventHandled) {
      return;
    }
    if (event) {
      const componentName = componentBuilder.getComponentName(event);
      const component = SidebarModule.getComponentDefinition(componentName);
      const id = this.componentCounter.getNextCounter();
      const ref = `${componentName}::${id}`;
      if (component) {
        const newComponent: PageData = componentBuilder.buildComponent(
          component,
          ref,
          PARENTCOMPONENT
        );
        PageModule.addNewPageElement(newComponent);
      }
    }
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
