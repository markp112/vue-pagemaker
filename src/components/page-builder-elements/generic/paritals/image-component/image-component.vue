<template>
<section>
  <div
    :ref="$props.thisComponent.ref"
    :id="$props.thisComponent.ref"
    class="handle"
    :class="getClass"
    :style="getStyles()"
    @click="onImageClicked($event)"  
    @mousedown="startDragImage($event)"
    @mousemove="dragElement($event)"
    @mouseup="stopDragImage($event)"
  >
    <img
      :src="getData"
      :style="getStyles()"
    />
    <resizeable
        :isActive="isImageActive"
        :parentContainerDimensions="$props.thisComponent.parent.boxDimensions"
        @resizeStarted="resizeStarted($event)"
        @onResize="onResize($event)"
      >
    </resizeable>
  </div>
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
  },
})
export default class ImageComponent extends mixins(GenericComponentMixins) {
  name = "image-component";

  created() {
    if (this.$props.thisComponent.styles.length === 0) {
      this.$props.thisComponent.setDefaultStyle();
    }
  }

  onImageClicked(event: Event) {
    event.stopPropagation();
    console.log('%c⧭', 'color: #f200e2', this.$props.thisComponent)
    PageModule.updateEditedComponentRef(this.$props.thisComponent);
    PageModule.updateShowEditDelete(true);
    SidebarModule.updateSidebarEditor();
  }

  stopDragImage(event: MouseEvent) {
    event.stopPropagation;
    this.stopDrag(event);
  }
  
  startDragImage(event: MouseEvent) {
    event.stopPropagation;
    this.startDrag(event);
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