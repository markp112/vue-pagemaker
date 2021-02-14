<template>
  <section>
    <h2 class="page-heading">Editing: {{ title }} Page</h2>
    <div
      :id="id"
      class="w-full h-auto relative p-4 border border-gray-400"
      :class="getClass()"
      ref="ROOT"
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
import Vue from "vue";
import Component from "vue-class-component";
import Container from "@/components/page-builder-elements/generic/container.vue";
import EditDeleteOption from "@/components/page-builder-elements/utility/edit-delete-options/edit-delete-options.vue";
import { PageModule } from "@/store/page/page";
import { SidebarModule } from "@/store/sidebar/sidebar";
import { ServicesModule } from "@/store/services/services";
import { ComponentCounter } from "@/classes/component-counter/singleton-counter";
import TextEditor from "@/components/base/text/text-editor/text-editor.vue";
import { PageContainer } from "@/classes/page-element/PageContainer/PageContainer";
import {
  PageElementClasses,
  PageElementFactory
} from "@/classes/page-element/factory/page-element-factory";
import { FirebaseDataBuilder } from "@/classes/page-element/firebase-data/FirebaseDataBuilder";

const PARENT = "ROOT";

@Component({
  props: {
    id: { default: "" }
  },
  components: {
    "edit-delete-option": EditDeleteOption,
    "text-editor": TextEditor,
    container: Container
  }
})
export default class PageBuilder extends Vue {
  name = "page-builder";
  title!: string;
  bgColour = "bg-gray-200";
  showModal = false;
  private componentCounter: ComponentCounter = ComponentCounter.getInstance();
  private componentFactory: PageElementFactory = new PageElementFactory();
  private rootComponent: PageContainer = this.componentFactory.createElement(
    "rootContainer",
    PARENT
  ) as PageContainer;

  created() {
    this.title = this.$route.params.title;
    PageModule.updatePageId(this.title);
    SidebarModule.setSidebarMenuTo("sidebar-components");
    const firebase = new FirebaseDataBuilder();
    firebase.retrievePageDataFromFirestore(this.title);
  }

  mounted() {
    const mainPageDiv = this.$refs.ROOT as HTMLDivElement;
    this.rootComponent.boxDimensions.width.value = mainPageDiv.clientWidth;
    this.rootComponent.boxDimensions.height.value = mainPageDiv.clientHeight;
    this.rootComponent.boxDimensions.top.value = mainPageDiv.clientTop;
    this.rootComponent.boxDimensions.left.value = mainPageDiv.clientLeft;
  }

  getStyleDimension(style: string): number {
    if (style === "") {
      return 0;
    }
    return parseInt(style.substring(0, style.length - 2));
  }

  get layoutElements(): PageElementClasses[] {
    return PageModule.pageElements;
  }

  get showTextModal(): boolean {
    return this.$store.getters.showTextModal;
  }

  get editedComponentText(): string {
    return PageModule.editedComponentData;
  }
  
  onDrop(event: DragEvent): void {
    if (ServicesModule.dragDropEventHandled) {
      return;
    }
    if (event) {
      const componentName = this.getComponentName(event);
      const component = SidebarModule.getComponentDefinition(componentName);
      const id = this.componentCounter.getNextCounter();
      const ref = `${componentName}::${id}`;
      if (component) {
        const pageElement = this.componentFactory.createElement(
          component.type,
          ref,
          component,
          this.rootComponent
        );
        PageModule.addNewPageElement(pageElement);
      }
    }
  }

  getComponentName(event: DragEvent): string {
    const dataTransfer = event.dataTransfer;
    return dataTransfer ? dataTransfer.getData("text") : "";
  }

  deleteClicked(): void {
    PageModule.deletePageElement;
  }

  getClass(): string {
    return this.bgColour;
  }

}
</script>
