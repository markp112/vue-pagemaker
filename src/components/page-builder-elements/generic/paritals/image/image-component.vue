<template>
  <div
    :ref="$props.thisComponent.ref"
    :id="$props.thisComponent.ref"
    class="handle select-none overflow-hidden"
    :style="getContainerStyles"
    @click="onImageClick($event)"
    @mousedown="startDragImage($event)"
    @mousemove="dragImageContainer($event)"
    @mouseup="stopDragImage($event)"
  >
      <img
        ref="image-element"
        class="absolute"
        :src="getImage()"
        :style="getImageStyles()"
        @mousedown="startPanImage($event)"
        @mousemove="panImage($event)"
        @mouseup="stopPanImage($event)"
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
import { GenericComponentMixins, MousePosition } from '../../mixins/generic-components-mixin';
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

  isPanImage = true;
  
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

  public dragImageContainer(event: MouseEvent) {
    if (!this.isDragging) return;
    const currentMousePosition: MousePosition = { x: event.pageX, y: event.pageY };
    const deltaX = currentMousePosition.x - this.lastMousePosition.x;
    const deltaY = currentMousePosition.y - this.lastMousePosition.y;

    const image = this.$props.thisComponent as ImageElement;

    image.containerLocation.top += deltaY;
    image.containerLocation.left += deltaX;
    this.lastMousePosition.x = event.pageX;
    this.lastMousePosition.y = event.pageY;
  }

  private startPanImage(event: MouseEvent) {
    event.stopPropagation();
    this.lastMousePosition = { x: event.pageX, y: event.pageY };
    this.isPanImage = true;
  }

  private stopPanImage(event: MouseEvent) {
    event.stopPropagation();
    this.isPanImage = false;

  }

  panImage(event: MouseEvent) {
    if (!this.isPanImage) return;
      const deltaChange = this.calcDeltaMouseChange(event);
      const image = this.$props.thisComponent as ImageElement;
      image.pan(deltaChange, 'image');   
      this.lastMousePosition = {
        x: event.pageX,
        y: event.pageY
      };
  }

  private calcDeltaMouseChange(event: MouseEvent): MousePosition {
    return {
      x: event.pageX - this.lastMousePosition.x,
      y:  event.pageY - this.lastMousePosition.y
    }
  }

}
</script>
