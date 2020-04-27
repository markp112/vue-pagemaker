<template>
  <div  
    :id="$props.thisComponent.ref" 
    class="handle"
    :class="getClasses()"
    :style="getStyles()"
    :ref="$props.thisComponent.ref"
    @dragover.prevent
    @drop.prevent="onDrop"
    @click="onClick()"
    @mouseup="handleMouseUp()"
    >
    <component :is="layout.componentHTMLTag" v-for="(layout,i) in $props.thisComponent.elements"
        :key="i"
        :index="i" 
        :thisComponent="layout"
        :parentDimensions="thisComponent.boxDimensions"
        @onClick.prevent="componentClick"
        z-index = "1"
        @dragover.prevent
        @drop.prevent="onDrop"
        >
    </component>
    <div
      class="triangle"
      :class ="{'active': isActive, 'in-active': !isActive}"
      @mousedown.stop.prevent="handleDown($event)"
      @mouseup="handleMouseUp()"
      @mousemove="handleMove($event)">
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { ComponentBuilder } from '@/classes/component-builder/component-builder';
import { Emit } from 'vue-property-decorator';
import { PageData, Style, ComponentContainer } from '@/models/page/page';
import GenericComponent from '@/components/page-builder-elements/generic/generic.vue';
import { PageModule } from '@/store/page/page';
import { ServicesModule } from '@/store/services/services';
import { SidebarModule } from '@/store/sidebar/sidebar';

@Component({
  props: {
    thisComponent: {
        default: (): ComponentContainer => { return new ComponentContainer() }
        },
  },
  components: {
    'generic-component': GenericComponent,
  },
})

export default class Container extends Vue {

  showBorder = false;
  isActive = false;
  isSizing = false;
  // parentWidth?: number;
  // parentHeight?: number;
  // thisContainer: BoxProperties = initBoxProperties;
  componentStyle = '';
  // handleDirection: handleDirectionType='xy';

  created() {
    this.showBorder = false;
    
  }

  mounted() {
  
  const parentElement: Element =  this.$parent.$el;
  this.$props.thisComponent.left = {value: this.$el.getBoundingClientRect().left, units: 'px'};
  this.$props.thisComponent.top = {value: this.$el.getBoundingClientRect().top, units: 'px'};
  // this.parentWidth = parentElement.clientWidth;
  // this.parentHeight = parentElement.clientHeight;
  // this.thisContainer = this.getElementBoxProperties();
  }

// getElementBoxProperties(): BoxProperties {
//   const boundingRect: BoxProperties = initBoxProperties;
//   boundingRect.x = this.$el.getBoundingClientRect().x;
//   boundingRect.y = this.$el.getBoundingClientRect().y;
//   boundingRect.width = this.$el.getBoundingClientRect().width;
//   boundingRect.height = this.$el.getBoundingClientRect().height;
//   boundingRect.top = this.$el.getBoundingClientRect().top;
//   boundingRect.left = this.$el.getBoundingClientRect().left;
//   return  boundingRect;
// }

  getClasses(): string {
    let componentClassSpec = this.$props.thisComponent.classDefinition;
    if(this.showBorder) {
      componentClassSpec += ' border1'
    }
    return componentClassSpec
  }

  getStyles(): string {
    let style: string;
    style = '';
    const component: ComponentContainer = this.$props.thisComponent;
    const styles: Style[] = component.styles;
    if ( styles.length > 0 ){
      styles.forEach(element => {
          style += `${element.style}:${element.value};`
      });
    }
    style += component.boxDimensions.getDimensionsAsStyleString;
    return style;
  }

  @Emit('componentClicked')
  onClick() {
    PageModule.updateEditedComponentRef(this.$props.thisComponent);
    PageModule.updateShowEditDelete(true);
    this.showBorder = !this.showBorder;
    this.isActive = !this.isActive;
    return
  }

  componentClick(event: Event) {
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    const componentBuilder = new ComponentBuilder();
    if (ServicesModule.dragDropEventHandled) { return }
    if (event) {
      const componentName = componentBuilder.getComponentName(event);
      const ref = `${componentName}::${PageModule.nextComponentId}`;
      const component = SidebarModule.getComponentDefinition(componentName);
      const parent: ComponentContainer  = this.$props.thisComponent; // when dropping a component this componet will be its parent
      if(component) {
        const newComponent: PageData = componentBuilder.buildComponent(component, ref, parent );
        parent.addNewElement(newComponent);
        ServicesModule.toggleDragDropEventHandled(true);
      }
    }
  }
  get getStyle(): string {
    return this.componentStyle;
  }

  handleMouseUp() {
    console.log("MouseUp")
    this.isSizing = false;
    window.removeEventListener('mousemove',() => {this.handleMove(event as MouseEvent)});
    window.removeEventListener('mouseup',() => {this.handleMouseUp()});
  }

  handleDown(ev: MouseEvent) {
    if (!this.isActive) return;
    
    // this.thisContainer = this.getElementBoxProperties();
    // this.handleDirection = 'xy'
    if(!this.isSizing) {
      window.addEventListener('mousemove',() => {this.handleMove(event as MouseEvent)});
      window.addEventListener('mouseup',() => {this.handleMouseUp()});
      this.isSizing = true
    }
  }

  handleMove(ev: MouseEvent) {
    if(!this.isSizing) return;
    // this.thisContainer = this.getElementBoxProperties();
    const boxLeft = this.$el.getBoundingClientRect().left + pageXOffset;
    const boxTop = this.$el.getBoundingClientRect().top + pageYOffset;
    this.$props.thisComponent.boxDimensions.width.value = (ev.clientX - boxLeft);
    this.$props.thisComponent.boxDimensions.width.units = 'px';
    this.$props.thisComponent.boxDimensions.height.value = (ev.clientY - boxTop);
    
    // this.componentStyle=`height:${this.$props.thisComponent.boxDimensions.height.value}px;width:${this.$props.thisComponent.boxDimensions.width.value}px`
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