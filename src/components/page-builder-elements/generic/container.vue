<template>
  <div  
    :id="$props.thisComponent.ref" 
    class="handle overflow-hidden"
    :class="getClasses()"
    :style="getStyles()"
    :ref="$props.thisComponent.ref"
    @dragover.prevent
    @drop.prevent="onDrop"
    @click.prevent="onClick"
    
    >
    <component :is="layout.componentHTMLTag" v-for="(layout,i) in $props.thisComponent.elements"
        :key="i"
        :index="i" 
        :thisComponent="layout"
        @onClick.prevent="componentClick($event)"
        z-index = "1"
        @dragover.prevent
        @drop.prevent="onDrop"
        >
    </component>
    <resizeable
      :isActive="isActive"
      :parentContainerDimensions="getBoundingRect()"
      @onResize="onResize"
    ></resizeable>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import { Emit } from 'vue-property-decorator';
import { PageData } from '@/models/page/page';
import { Style } from '@/models//styles/styles';
import GenericComponent from '@/components/page-builder-elements/generic/generic.vue';
import { PageModule } from '@/store/page/page';
import { ServicesModule } from '@/store/services/services';
import { SidebarModule } from '@/store/sidebar/sidebar';
import { ComponentCounter } from '@/classes/component-counter/singleton-counter';
import Resize from '@/components/base/resizeable/resize.vue';
import { BoxDimensions, BoxDimensionsInterface, BoxUnits, Dimension } from '../../../models/components/box-dimension';
import { GenericComponentMixins } from '@/components/page-builder-elements/generic/mixins/generic-components-mixin';
import { PageElementBuilder } from '@/classes/page-element/page-element-builder/PageElementBuilder'
import { ComponentContainer } from '@/classes/page-element/ComponentContainer';
import { PageElementClasses, PageElementFactory } from '@/classes/page-element/factory/page-element-factory';

@Component({
  props: {
    thisComponent: {
      default: (): ComponentContainer => { return new ComponentContainer(new PageElementBuilder()) }
    },
  },
  components: {
    'generic-component': GenericComponent,
    resizeable: Resize,
  },
})

export default class Container extends mixins(GenericComponentMixins) {
  private isSizing = false;
  private componentStyle = '';
  private componentCounter: ComponentCounter = ComponentCounter.getInstance();

  created() {
      const pageElement: PageElementClasses = this.$props.thisComponent;
    if (pageElement) {
      pageElement.setDefaultStyle();
    }
  }

  mounted() {
    const parentElement: Element = this.$parent.$el;
    // -- convert width and height into pixels as initial dimension may be a percentage and cannot then be used
    // by the child component to get the actual width / height
    this.$props.thisComponent.boxDimensions.width = { value: this.$el.getBoundingClientRect().width, units: 'px' };
    this.$props.thisComponent.boxDimensions.height = { value: this.$el.getBoundingClientRect().height, units: 'px' };
  }

  @Emit('componentClicked')
  onClick(ev: Event) {
    ev.stopPropagation();
    PageModule.updateEditedComponentRef(this.$props.thisComponent);
    PageModule.updateShowEditDelete(true);
    this.showBorder = !this.showBorder;
  }

  componentClick(event: Event) {
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    const componentFactory = new PageElementFactory();
    if (ServicesModule.dragDropEventHandled) { return }
    if (event) {
      const componentName = this.getComponentName(event);
      const id: number = this.componentCounter.getNextCounter();
      const ref = `${componentName}::${id}`;
      const component = SidebarModule.getComponentDefinition(componentName);
      const parent: ComponentContainer  = this.$props.thisComponent; // when dropping a component this componet will be its parent
      if(component) {
        const newComponent: PageElementClasses = componentFactory.createElement (component.type, component, ref, parent );
        parent.addNewElement(newComponent);
        ServicesModule.toggleDragDropEventHandled(true);
      }
    }
  }

  getComponentName (event: DragEvent): string {
    const dataTransfer = event.dataTransfer;
    return dataTransfer ? dataTransfer.getData('text') : '';
  }

  get getStyle(): string {
    return this.componentStyle;
  }

  get isActive(): boolean {
    return PageModule.selectedComponent === (this.$props.thisComponent as ComponentContainer).ref;
  }

  getBoundingRect(): BoxDimensions | null {
    if (!this.$el) return null;
    if (!this.$el.parentElement) return null;
    const parentElement = this.$el.parentElement;
    const boxLeft: Dimension = {
      value: parentElement.getBoundingClientRect().left + pageXOffset,
      units: 'px',
    };
    const boxTop: Dimension = {
      value: this.$el.getBoundingClientRect().top + pageYOffset,
      units: 'px',
    };
    const boxWidth: Dimension = {
      value: parentElement.getBoundingClientRect().width,
      units: 'px',
    };
    const boxHeight: Dimension = {
      value: this.$el.getBoundingClientRect().height,
      units: 'px',
    };
    return new BoxDimensions(boxWidth, boxHeight, boxTop, boxLeft)
  }
}
</script>

<style lang="postcss">
  .border-outline {
    @apply border-red-600 border-8 border-dashed;
  }

  .handle {
    position: relative;
    box-sizing: border-box;
  }
.border1 {
  @apply border-indigo-800 border border-dashed;
}

.triangle {
  content: '';
  position: absolute;
  bottom: -6px;
  right: -1px;
  box-sizing: border-box;
  cursor: nwse-resize;
  width: 0;
	height: 0;
	text-indent: -9999px;
	border-top: 10px solid transparent;
	border-bottom: 10px solid transparent;
	border-left: 10px solid rgb(56, 55, 56);
  transform:rotate(45deg);
}
  
.active {
  visibility: visible;
}

.in-active {
  visibility: hidden;
}

</style>