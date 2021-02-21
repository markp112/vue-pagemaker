<template>
  <section>
    <div
      ref="imageContainer"
      class="handle object-contain"
      :id="$props.thisComponent.ref"
      @click.prevent="onClick($event)"
    >
      <img
        ref="imageElement"
        class="absolute bg-no-repeat "
        :style="getImageStyles()"
        :class="{ 'cursor-pan': draggingStarted }"
        @mousedown="onDraggingStarted($event)"
        @mouseup="onDraggingStop()"
      />
      <resizeable
        :isActive="isActive"
        :parentContainerDimensions="$props.thisComponent.parent.boxDimensions"
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
        />
      </div>
    </div>
  </section>
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
import { ClientCoordinates } from '@/models/components/components';
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
) {
  name = 'ImageComponentBackground';
  HTML_IMAGE_ELEMENT = 'imageElement';
  HTML_IMAGE_PARENT = 'imageContainer';
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
  }

  mounted() {
    this.parentContainer = this.$refs[this.HTML_IMAGE_PARENT] as HTMLDivElement;
    this.image = this.$refs[this.HTML_IMAGE_ELEMENT] as HTMLImageElement;
    const imageElement = this.component;
    let styles: string = this.component.getContainerStyles();
    this.parentContainer.setAttribute('style', styles);
    this.imageManipulator = new ImageManipulator(imageElement);
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
    return PageModule.selectedComponent === this.$props.thisComponent.ref;
  }

  getImageStyles(): string {
    return (this.component as ImageElement).getStyles();
  }

  onClick(event: Event) {
    event.stopPropagation();
    SidebarModule.updateSidebarEditor(false);
    PageModule.updateEditedComponentRef(this.$props.thisComponent);
    PageModule.updateShowEditDelete(true);
  }

  onDraggingStarted(event: MouseEvent) {
    this.onClick(event);
    const parent = this.$refs[this.HTML_IMAGE_PARENT] as HTMLDivElement;
    this.draggingStarted = true;
    const lastMousePosition = {
      x: event.pageX - parent.offsetLeft,
      y: event.pageY - parent.offsetTop
    };
    this.imageManipulator.lastMousePosition = lastMousePosition;
    window.addEventListener('mousemove', this.panImage);
    window.addEventListener('mouseup', this.onDraggingStop);
  }

  onDraggingStop() {
    this.draggingStarted = false;
    window.removeEventListener('mousemove', this.panImage);
    window.removeEventListener('mouseup', this.onDraggingStop);
  }

  /**
   * @description move the image within the parent container
   */
  // dragImage(event: MouseEvent) {
  //   this.dragElement(event);
  // }

  startDragImage(event: MouseEvent) {
    const componentToDrag = this.$refs[this.HTML_IMAGE_PARENT] as HTMLDivElement;
    this.startDrag(event, componentToDrag);
    window.addEventListener('mousemove', this.dragImage);
    window.addEventListener('mouseup', this.stopDragImage);
  }

  stopDragImage(event: MouseEvent) {
    const componentToDrag = this.$refs[this.HTML_IMAGE_PARENT] as HTMLDivElement;
    this.stopDrag(event, componentToDrag);
    window.removeEventListener('mousemove', this.dragImage);
    window.removeEventListener('mouseup', this.stopDragImage);
  }

  dragImage(event: MouseEvent) {
    console.log('%c%s', 'color: #7f2200', 'dragImage')
    if (!this.isDragging) return;
    event.stopPropagation;
    const currentMousePosition: MousePosition = { x: event.pageX, y: event.pageY };
    const deltaX = currentMousePosition.x - this.lastMousePosition.x;
    const deltaY = currentMousePosition.y - this.lastMousePosition.y;
    const containerLocation = (this.$props.thisComponent as ImageElement).containerLocation;
    containerLocation.top += deltaY;
    containerLocation.left += deltaX;
    this.parentContainer.style.left = containerLocation.left + 'px';
    this.parentContainer.style.top = containerLocation.top + 'px';
    this.lastMousePosition = { ...currentMousePosition }
  }

  panImage(event: MouseEvent) {
    if (!this.draggingStarted) {
      return false;
    }
    const currentMousePosition: MousePosition = this.getMousePosition(
      event.pageX,
      event.pageY,
      this.HTML_IMAGE_PARENT
    );
    const style = this.imageManipulator.pan(currentMousePosition);
    PageModule.updateEditedComponentStyles(style);
  }

  resizeStarted(event: MouseEvent) {
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
    this.imageManipulator.imageElement.containerDimensions.height + 'px';
    (this.$props.thiscomponent as ImageElement).containerDimensions.height
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
