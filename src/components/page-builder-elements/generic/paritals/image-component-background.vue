<template>
    <div
      ref="image-container"
      class="handle object-contain"
      :id="$props.thisComponent.ref"
      @click.prevent="onClick($event)"
      :style="getDimensions()"
    >
      <img
        ref="image-element"
        class="absolute bg-no-repeat "
        :style="getImageStyles()"
        style="resize: both"
        :class="{ 'cursor-pan': draggingStarted }"
        @mousedown="onDraggingStarted($event)"
        @mousemove="panImage($event)"
        @mouseup="onDraggingStop($event)"
      />
      <resizeable
        :isActive="isActive"
        @resizeStarted="resizeStarted($event)"
        @onResize="resizeImage($event)"
      >
      </resizeable>
      <div class="w-full absolute bottom-0">
        <img
          v-if="isActive"
          :src="getPath('move-32.png')"
          class="controlIcon -bottom-3 block mr-auto ml-auto select-none"
          @mousedown="startDragImage($event)"
          @mousemove="dragImage($event)"
          @mouseup="stopDragImage($event)"

        />
      </div>
    </div>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import Resize from '@/components/base/resizeable/resize.vue';
import { ImageElement } from '@/classes/page-element/page-components/image-element/ImageElement';
import {
  GenericComponentMixins,
  MousePosition
} from '../mixins/generic-components-mixin';
import { PageModule } from '@/store/page/page';
import { ClientCoordinates, Location } from '@/models/components/components';
import {
  ImageManipulator,
} from '@/classes/images/image-manipulation/imageManipulation';
import { PageElementBuilder } from '@/classes/page-element/page-element-builder/PageElementBuilder';
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
export default class ImageComponentBackground extends mixins(
  GenericComponentMixins
) 
{
  name = 'ImageComponentBackground';
  HTML_IMAGE_ELEMENT = 'image-element';
  HTML_IMAGE_PARENT = 'image-container';
  draggingStarted = false;
  isResizing = true;
  parentContainer: HTMLDivElement = this.$refs[
    this.HTML_IMAGE_PARENT
  ] as HTMLDivElement;
  image: HTMLImageElement = new Image();
  component!: ImageElement;
  imageManipulator!: ImageManipulator;

  created() {
    this.component = this.$props.thisComponent;
    if (this.$props.thisComponent.styles.length === 0) {
      this.$props.thisComponent.setDefaultStyle();
    }
  }

  mounted() {
    this.parentContainer = this.$refs[this.HTML_IMAGE_PARENT] as HTMLDivElement;
    this.image = this.$refs[this.HTML_IMAGE_ELEMENT] as HTMLImageElement;
    let styles: string = this.component.getContainerStyles();
    this.parentContainer.setAttribute('style', styles);
    this.imageManipulator = new ImageManipulator(this.component);
    styles = this.getImageStyles();
    this.image.setAttribute('style', styles);
  }

  get getData(): string {
    const component: ImageElement = this.$props.thisComponent;
    if (component) {
      return component.content;
    }
    return '';
  }

  get isActive(): boolean {
    return PageModule.selectedComponent === this.component.ref;
  }

  getImageStyles(): string {
    return (this.component as ImageElement).getStyles();
  }

  getDimensions(): string {
    const image: ImageElement = this.$props.thisComponent;
    const style = `height:${image.containerDimensions.height}px;
      width:${image.containerDimensions.width}px`;
    return style;
  }

  onClick(event: Event) {
    event.stopPropagation();
    if (this.draggingStarted) this.draggingStarted = false;
    if (this.isDragging) this.isDragging = false;
    /**
     * @important - dont change order of execution
     */
    PageModule.updateEditedComponentRef(this.$props.thisComponent);
    SidebarModule.updateSidebarEditor();
    PageModule.updateShowEditDelete(true);
  }

  onDraggingStarted(event: MouseEvent) {
    event.stopPropagation();
    const parent = this.$refs[this.HTML_IMAGE_PARENT] as HTMLDivElement;
    this.draggingStarted = true;
    const lastMousePosition = {
      x: event.pageX - parent.offsetLeft,
      y: event.pageY - parent.offsetTop
    };
    this.imageManipulator.lastMousePosition = lastMousePosition;
  }

  onDraggingStop(event: MouseEvent) {
    event.stopPropagation();
    this.draggingStarted = false;
  }

  /**
   * @description move the image within the parent container
   */
  // dragImage(event: MouseEvent) {
  //   this.dragElement(event);
  // }

  startDragImage(event: MouseEvent) {
    event.stopPropagation();
    const componentToDrag = this.$refs[this.HTML_IMAGE_PARENT] as HTMLDivElement;
    this.startDrag(event, componentToDrag);
    window.addEventListener('mousemove', this.dragImage);
    window.addEventListener('mouseup', this.stopDragImage);
  }

  stopDragImage(event: MouseEvent) {
    event.stopPropagation();
    this.isDragging = false;
    const componentToDrag = this.$refs[this.HTML_IMAGE_PARENT] as HTMLDivElement;
    this.stopDrag(event, componentToDrag);
    window.removeEventListener('mousemove', this.dragImage);
    window.removeEventListener('mouseup', this.stopDragImage);
  }

  dragImage(event: MouseEvent) {
    if (!this.isDragging) return;
    console.log('%c%s', 'color: #73998c', this.isDragging)
    event.stopPropagation;
    const currentMousePosition: MousePosition = { x: event.pageX, y: event.pageY };
    const deltaX = currentMousePosition.x - this.lastMousePosition.x;
    const deltaY = currentMousePosition.y - this.lastMousePosition.y;
    const containerLocation: Location = (this.$props.thisComponent as ImageElement).containerLocation;
    containerLocation.top += deltaY;
    containerLocation.left += deltaX;
    this.parentContainer.style.left = containerLocation.left + 'px';
    this.parentContainer.style.top = containerLocation.top + 'px';
    this.lastMousePosition = { ...currentMousePosition }
  }

  panImage(event: MouseEvent) {
    event.stopPropagation();
    if (!this.draggingStarted) {
      return false;
    }
    const currentMousePosition: MousePosition = this.getMousePosition(
      event.pageX,
      event.pageY,
    );
    const style = this.imageManipulator.pan(currentMousePosition);
    PageModule.updateEditedComponentStyles(style);
  }

  resizeStarted(event: MouseEvent) {
    event.stopPropagation();
    const lastMousePosition = {
      x: event.screenX,
      y: event.screenY,
    };
    this.imageManipulator.lastMousePosition = lastMousePosition;
  }

  resizeImage(coordinates: ClientCoordinates) {
    const currentMousePosition: MousePosition = {
      x: coordinates.clientX,
      y: coordinates.clientY,
    };
    this.imageManipulator.resize(currentMousePosition);
    this.parentContainer.style.height =
      this.imageManipulator.imageElement.containerDimensions.height + 'px';
    this.parentContainer.style.width =
      this.imageManipulator.imageElement.containerDimensions.width + 'px';
  }

}
</script>

<style scoped>
.handle {
  position: relative;
  box-sizing: border-box;
}

.controlIcon {
  @apply cursor-pointer;
  @apply z-30;
  @apply h-8;
  @apply w-8;
}
</style>
