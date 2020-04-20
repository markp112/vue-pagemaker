<template>
  <div  
    :id="$props.thisComponent.ref" 
    class="handle"
    :class="getClasses()"
    :style="getStyle"
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
        @onClick.prevent="componentClick"
        z-index = "1"
        @dragover.prevent
        @drop.prevent="onDrop"
        >
    </component>
    <div
      v-for="handle in handles"
      :key="handle"
      class="handle-stick"
      :class="['handle-stick-' + handle]"
      :style="grabHandles(handle)"
      @mousedown.stop.prevent="handleDown(handle, $event)"
      @mouseup="handleMouseUp()"
      @touchstart.stop.prevent="handleDown(handle, $event)"
      @mousemove="handleMove(handle, $event)"
      >
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

type yTypes = 't' | 'm' | 'b';
type xTypes = 'l' | 'm' | 'r';
type handleStartPosType = 'mouseX' | 'mouseY' | 'x' | 'y' | 'w' | 'h';
type handleDirectionType = 'y' | 'x' | 'xy'

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
  parentWidth?: number;
  parentHeight?: number;
  thisContainer = {
    height: 0,
    width: 0,
    x: 0,
    y: 0,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  }
  handles = [ 'tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml' ];
  handleSize = 8;
  componentStyle = '';
  styleMapping = {
    y: {
        t: 'top',
        m: 'margin-top',
        b: 'bottom',
    },
    x: {
        l: 'left',
        m: 'margin-left',
        r: 'right',
    }
};
parentScaleX = 1;
parentScaleY = 1;
handleStartPos = { mouseX: 0, mouseY: 0, x: 0, y: 0, w: 0, h: 0 };
handleDirection: handleDirectionType = 'x';

  created() {
    this.showBorder = false;
    
  }

  mounted() {
  const parentElement: Element =  this.$parent.$el;
  this.parentWidth = parentElement.clientWidth;
  this.parentHeight = parentElement.clientHeight;
  this.thisContainer = this.$el.getBoundingClientRect();

  console.log("element=", this.$el.getBoundingClientRect(), this.thisContainer);
  

  }

  getClasses(): string {
      let componentClassSpec = this.$props.thisComponent.classDefinition;
      if(this.showBorder) {
        componentClassSpec += ' border1'
      }
      componentClassSpec += this.isActive ? ' handle.active' : ' inactive'
      return componentClassSpec
  }

  getStyles(): string {
    let style: string;
    style = '';
    const styles: Style[] = this.$props.thisComponent.styles;
    if ( styles.length > 0 ){
      styles.forEach(element => {
          style += `${element.style}:${element.value};`
      });
    }
    return style;
  }

  @Emit('componentClicked')
  onClick() {
    console.log("clicked")
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
        console.log("Parent = ", parent)
        console.log("Componet=", newComponent)
        parent.addNewElement(newComponent);
        ServicesModule.toggleDragDropEventHandled(true);
      }
    }
  }
  get getStyle(): string {

    return this.componentStyle;
  }
  get grabHandles() {
    return (stick: string) => {
          const handleStyle = {
              width: `${this.handleSize / this.parentScaleX}px`,
              height: `${this.handleSize / this.parentScaleY}px`,
          };
          const firstLetter: yTypes = stick.charAt(0) as yTypes;
          const secondLetter: xTypes = stick.charAt(1) as xTypes; 
          const yStyle = `${this.styleMapping.y[firstLetter]}:${this.handleSize / this.parentScaleX / -2}px;`;
          const xStyle = `${this.styleMapping.x[secondLetter]}:${this.handleSize / this.parentScaleX / -2}px;`;
          return `height:${handleStyle.height}; width:${handleStyle.width};${yStyle}${xStyle}`;
    }
  }

  handleMouseUp() {
    this.isSizing = false;
  }

  handleDown(handle: string , ev: MouseEvent){
    const handleStartPos = this.handleStartPos;
    
  this.thisContainer = this.$el.getBoundingClientRect();
  const firstLetter = handle.charAt(0);
  const secondLetter = handle.charAt(1);
  switch (firstLetter)  {
    case 't' || 'b':
      this.handleDirection = 'y'
      break;
  };
  switch(secondLetter) {
    case 'r' || 'l':
      this.handleDirection = this.handleDirection === 'y' ? 'xy' : 'x'
  };

  if(this.isActive) { 
      window.addEventListener('mousemove', this.hm())
      window.addEventListener('mouseup', stopResize)
    this.isSizing = true };



  }

  handleMove(handle: string, ev: MouseEvent) {
    if(!this.isSizing) return
    const handleStartPos = this.thisContainer
    console.log("mousemove ", ev)
    console.log("this container", this.thisContainer)
   let newWidth =this.$el.getBoundingClientRect().width;
    // const newHeight = this.thisContainer.height + ev.y - this.thisContainer.y;
    let newHeight = this.$el.getBoundingClientRect().height;
    if (this.handleDirection === 'y') {
        newHeight = ev.pageY - this.$el.getBoundingClientRect().top;
    }
      if (this.handleDirection === 'x') {
        newWidth = ev.pageX - this.$el.getBoundingClientRect().left;
    }
    
    const delta = {
      x: (handleStartPos.x - ev.x) / this.parentScaleX, 
      y: (handleStartPos.y - ev.y) / this.parentScaleX
    }
      console.log('%c⧭', 'color: #00bf00', delta)
    
// height:${this.thisContainer.height}px;
    
    // this.thisContainer.top += delta.y;
    this.componentStyle=`height:${newHeight}px;width:${newWidth}px;`
    
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
.handle.active:before{
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    box-sizing: border-box;
    outline: 1px dashed #d6d6d6;
}
.handle-stick {
    box-sizing: border-box;
    position: absolute;
    font-size: 1px;
    background: #ffffff;
    border: 1px solid #6c6c6c;
    box-shadow: 0 0 2px #bbb;
}
.inactive .handle-stick {
    display: none;
}
.handle-stick-tl, .handle-stick-br {
    cursor: nwse-resize;
}
.handle-stick-tm, .handle-stick-bm {
    left: 50%;
    cursor: ns-resize;
}
.handle-stick-tr, .handle-stick-bl {
    cursor: nesw-resize;
}
.handle-stick-ml, .handle-stick-mr {
    top: 50%;
    cursor: ew-resize;
}
.handle-stick.not-resizable{
    display: none;
}
</style>