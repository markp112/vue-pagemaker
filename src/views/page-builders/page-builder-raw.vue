<template>
  <section>
    <p class="page-heading">Editing: {{ title }} Page</p>
    <div
      :id="id"
      class="w-full  h-full relative p-2 border border-gray-400"
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
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Container from '@/components/page-builder-elements/generic/container.vue';
import { PageData, ComponentContainer } from '@/models/page/page';
import { ComponentBuilder } from '@/classes/component-builder/component-builder';
import EditDeleteOption from '@/components/page-builder-elements/utility/edit-delete-options/edit-delete-options.vue';

const PARENT = 'ROOT';
const PARENTCOMPONENT = new ComponentContainer();

PARENTCOMPONENT.ref = PARENT;

@Component({
  props: {
    id: { default: '' },
  },
  components: {
    'edit-delete-option': EditDeleteOption,
    container: Container,
  },
})
export default class PageBuilder extends Vue {
  name = 'pageBuilder';
  title!: string;
  bgColour = 'bg-gray-200';

  created() {
    this.title = this.$route.params.title;
    this.$store.dispatch('toggleSidebar', true);
  }

  get layoutElements(): PageData[] {
    return this.$store.getters.pageElements;
  }

  onDrop(event: DragEvent): void {
    const componentBuilder = new ComponentBuilder();
    if (this.$store.getters.dragDropEventHandled) {
      return;
    }
    if (event) {
      const componentName = componentBuilder.getComponentName(event);
      const component = this.$store.getters.componentDefinition(componentName);
      console.log('%c⧭', 'color: #00a3cc', component)
      const ref = `${componentName}::${this.$store.getters.nextComponentId}`;
      const newComponent: PageData = componentBuilder.buildComponent(component, ref, PARENTCOMPONENT);
      this.$store.dispatch('addNewPageElement', newComponent);
    }
  }

  deleteClicked(): void {
    this.$store.dispatch('deletePageElement');
  }

  getClass(): string {
    return this.bgColour;
  }
}
</script>
