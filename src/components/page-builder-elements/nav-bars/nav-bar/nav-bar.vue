<template>
  <div class="w-full bg-blue-500 h-24 flex flex-row justify-start"   :id="$props.thisComponent.ref" 
    :class="{'border': showBorder}"
    :ref="$props.thisComponent.ref"
    @dragover.prevent
    @drop.prevent="onDrop"
    @click.prevent="onClick()">
    <component :is="layout.component" v-for="(layout,i) in $props.thisComponent.elements"
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
import  BaseButton  from '@/components/page-builder-elements/buttons/base-button.vue'
import GenericComponent from '@/components/page-builder-elements/generic/generic.vue';

@Component({
  props:{
    thisComponent:{default: (): PageData => { return new PageContainer()}},
  },
  components: {
    'base-button': BaseButton,
    'generic-button': GenericComponent,
  }

})

export default class NavBarEditor extends Vue {

showBorder = false;

created() {
  this.showBorder = false;
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
    const componentId = componentBuilder.getComponentID(event);
    const ref = `${componentId}::${this.$store.getters.nextComponentId}`;
    const newComponent: PageData = componentBuilder.buildComponent(componentId, ref, this.$props.thisComponent.ref);
    this.$store.dispatch('addNewPageElement', newComponent);
    this.$store.dispatch('toggleDragDropEventHandled', true);
  }
}

}
</script>

<style lang="postcss">
  .border {
    @apply border-red-600 border-8 border-dashed;
  }
</style>