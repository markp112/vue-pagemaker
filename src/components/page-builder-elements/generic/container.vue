<template>
  <div  
    :id="$props.thisComponent.ref" 
    :class="getClasses()"

    :ref="$props.thisComponent.ref"
    @dragover.prevent
    @drop.prevent="onDrop"
    @click.prevent="onClick()"
    @mousedown="select()"
    class="handle handle-stick"
    >
    <component :is="layout.componentHTMLTag" v-for="(layout,i) in $props.thisComponent.elements"
        :key="i"
        :index="i" 
        :thisComponent="layout"
        @onClick="componentClick"
        z-index = "1"
        @dragover.prevent
        @drop.prevent="onDrop"
        >
    </component>
    <div
            v-for="stick in sticks"
            :key="stick"
            class="handle-stick"
            :class="['handle-stick-' + stick]"
          
            :style="vdrStick(stick)">
            {{stick}}
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
  parentWidth?: number;
  parentHeight?: number;
  sticks = ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml']
  stickSize = 8;
  styleMapping = {
    y: {
        t: 'top',
        m: 'marginTop',
        b: 'bottom',
    },
    x: {
        l: 'left',
        m: 'marginLeft',
        r: 'right',
    }
};
parentScaleX =100;
parentScaleY = 100;

  created() {
    this.showBorder = false;
    
  }

  mounted() {
  const parentElement: Element =  this.$parent.$el;
  this.parentWidth = parentElement.clientWidth;
  console.log('%c%s', 'color: #0088cc', this.parentWidth)
  this.parentHeight = parentElement.clientHeight;
  console.log('%c%s', 'color: #00bf00', this.parentHeight)

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
    PageModule.updateEditedComponentRef(this.$props.thisComponent);
    PageModule.updateShowEditDelete(true);
    this.showBorder = !this.showBorder;
    return
  }

  select() {
    this.isActive = !this.isActive;
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

 vdrStick(stick: string) {
  console.log("stick", stick)
        const stickStyle = {
            width: `${this.stickSize / this.parentScaleX}px`,
            height: `${this.stickSize / this.parentScaleY}px`,
        };
        stickStyle.height = `${this.stickSize / this.parentScaleX / -2}px`;
        stickStyle.width = `${this.stickSize / this.parentScaleX / -2}px`;
        console.log('%c⧭', 'color: #f2ceb6', stickStyle)
        
        return stickStyle;
    
}

}
</script>

<style lang="postcss">
  .border-outline {
    @apply border-red-600 border-8 border-dashed;
  }

  .handle {
    position:relative;
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
    position: relative;
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