<template>
  <section
    :ref="$props.thisComponent.ref"
    :id="$props.thisComponent.ref"
    class="handle select-none"
    :class="getClass"
    :style="getStyles()"
    @click="onThisImageClick($event)"  
    @mousedown="startDragImage($event)"
    @mousemove="dragElement($event)"
    @mouseup="stopDragImage($event)"
  >
    <img
      :src="getData"
      :style="getStyles()"
      alt=""
      :ref="$props.thisComponent.ref"
      :id="$props.thisComponent.ref"
    >
    <resizeable
        :isActive="isImageActive"
        :parentContainerDimensions="$props.thisComponent.parent.boxDimensions"
        @resizeStarted="resizeStarted($event)"
        @onResize="onResize($event)"
      >
    </resizeable>
  </section>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import Resize from '@/components/base/resizeable/resize.vue';
import { GenericComponentMixins } from '../../mixins/generic-components-mixin';
import { ImageElement } from '@/classes/page-element/page-components/image-element/ImageElement';
import { PageElementBuilder } from '@/classes/page-element/page-element-builder/PageElementBuilder';
import { PageModule } from '@/store/page/page';
import { SidebarModule } from '@/store/sidebar/sidebar';

@Component({
  props: {
    thisComponent: {
      default: (): ImageElement => {
        return new PageElementBuilder().buildAnImage();
      }
    }
  },
  components: {
    resizeable: Resize,
  }
})
export default class ImageComponent extends mixins(GenericComponentMixins) {
  name="image-component";

  created() {
    if (this.$props.thisComponent.styles.length === 0) {
      this.$props.thisComponent.setDefaultStyle();
    }
  }

  onThisImageClick(event: Event) {
    event.stopPropagation();
    PageModule.updateEditedComponentRef(this.$props.thisComponent);
    SidebarModule.updateSidebarEditor();
    PageModule.updateShowEditDelete(true);
  }

  stopDragImage(event: MouseEvent) {
    const componentToDrag = this.$refs[this.$props.thisComponent.ref] as HTMLDivElement;
    this.stopDrag(event, componentToDrag);
  }
  
  startDragImage(event: MouseEvent) {
    const componentToDrag = this.$refs[this.$props.thisComponent.ref] as HTMLDivElement;
    this.startDrag(event, componentToDrag);
  }

  get getData(): string {
    return this.$props.thisComponent.content;
  }

  get getClass(): string {
    return this.$props.thisComponent.classDefinition;
  }

  get isImageActive(): boolean {
    return PageModule.selectedComponent === this.$props.thisComponent.ref;
  }

}
</script>

<style scoped>
.handle {
  position: relative;
  box-sizing: border-box;
}
</style>