<template>
  <div  
    :id="$props.thisComponent.ref" 
    :class="getClasses()"
    :ref="$props.thisComponent.ref"
    @dragover.prevent
    @drop.prevent="onDrop"
    @click.prevent="onClick()">
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { ComponentBuilder } from '@/classes/component-builder/component-builder';
import { Emit } from 'vue-property-decorator';
import { PageData, Style, PageContainer } from '@/models/page/page';
import GenericComponent from '@/components/page-builder-elements/generic/generic.vue';

@Component({
  props:{
    thisComponent:{default: (): PageData => { return new PageContainer()}},
  },
  components: {
    'generic-button': GenericComponent,
  }

})

export default class Container extends Vue {

showBorder = false;

created() {
  this.showBorder = false;
}


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
  this.$store.dispatch('updateEditedComponentRef', this.$props.thisComponent)
  this.$store.dispatch('updateShowEditDelete', true)
  this.showBorder = !this.showBorder;
  return
}

componentClick(event: Event) {
  event.stopPropagation();
}

onDrop(event: DragEvent) {
  const componentBuilder = new ComponentBuilder();
  if(this.$store.getters.dragDropEventHandled) { return }
  if(event) {
    const componentName = componentBuilder.getComponentName(event);
    const ref = `${componentName}::${this.$store.getters.nextComponentId}`;
    const component = this.$store.getters.componentDefinition(componentName);
    const parent = this.$props.thisComponent.ref; // when dropping a component this componet will be its parent
    const newComponent: PageData = componentBuilder.buildComponent(component, ref, parent );
    this.$store.dispatch('addNewPageElement', newComponent);
    this.$store.dispatch('toggleDragDropEventHandled', true);
  }
}

}
</script>

<style lang="postcss">
  .border-outline {
    @apply border-red-600 border-8 border-dashed;
  }
</style>