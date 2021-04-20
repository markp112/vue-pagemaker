<template>
  <div
    :ref="$props.thisComponent.ref"
    :id="$props.thisComponent.ref"
    class="handle select-none "
    :style="getContainerStyles"
    @click="onImageClick($event)"
  >
      <img
        ref="image-element"
        :src="getImage()"
        :style="getImageStyles()"

        @mousedown="startDragImage($event)"
        @mousemove="dragElement($event)"
        @mouseup="stopDragImage($event)"
      />
      <resizeable
        :isActive="isActive()"
        :parentContainerDimensions="$props.thisComponent.boxDimensions"
        @resizeStarted="resizeStarted($event)"
        @onResize="onResizeImage($event)"
      >
      </resizeable>
    </div>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import Resize from '@/components/base/resizeable/resize.vue';
import { ImageElement } from '@/classes/page-element/page-components/image-element/ImageElement';
import { PageElementBuilder } from '@/classes/page-element/page-element-builder/PageElementBuilder';
import { GenericComponentMixins } from '../../mixins/generic-components-mixin';
import { PageModule } from '@/store/page/page';
import { SidebarModule } from '@/store/sidebar/sidebar';
import { BoxDimensionsInterface, BoxProperties } from '@/models/components/box-dimension';
import { ADimension } from '@/classes/dimensions/adimensions';
import { ClientCoordinates } from '@/models/components/components';

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
export default class ImageComponent extends GenericComponentMixins {
  name = "imageComponent";
  
  getImageStyles(): string {
    const image = this.$props.thisComponent as ImageElement;
    return image.getImageStyle();
  }

  get getContainerStyles() {
    const image = this.$props.thisComponent as ImageElement;
    return image.getContainerStyles();
  }

  getImage(): string {
    return (this.$props.thisComponent as ImageElement).content;
  }

  onImageClick(event: MouseEvent) {
    event.stopPropagation();
    PageModule.updateEditedComponentRef(this.$props.thisComponent);
    SidebarModule.updateSidebarEditor();
    PageModule.updateShowEditDelete(true);
  }

  startDragImage(event: MouseEvent) {
    event.stopPropagation();
    const componentToDrag = this.$refs[this.$props.thisComponent.ref] as HTMLDivElement;
    this.startDrag(event, componentToDrag);
  }

  stopDragImage(event: MouseEvent): void {
    event.stopPropagation();
    const componentToDrag = this.$refs[this.$props.thisComponent.ref] as HTMLDivElement;
    this.stopDrag(event, componentToDrag);
  }

  isActive(): boolean {
    return PageModule.selectedComponent === this.$props.thisComponent.ref;
  }

  
  onResizeImage(boxProperties: ClientCoordinates) {
    if (this.isDragging) return;
    const thisComponent = this.$props.thisComponent;
    const boundingRect: BoxProperties | null = this.getElementBoxProperties(
      thisComponent.ref
    );
    if (boundingRect) {
      const currentMousePosition = this.getMousePosition(
        boxProperties.clientX,
        boxProperties.clientY,
        );
      const changeX = currentMousePosition.x - this.lastMousePosition.x;
      const changeY = currentMousePosition.y - this.lastMousePosition.y;
      this.lastMousePosition = { ...currentMousePosition };
      const boxDimensions: BoxDimensionsInterface = this.calculateNewDimensions(
        boundingRect,
        changeY,
        changeX
        );
      const dimension: ADimension = new ADimension(boxDimensions.height.value, boxDimensions.width.value, 'px');
      const image = this.$props.thisComponent as ImageElement;
      image.containerDimensions = dimension;
    }
  }

}
</script>
