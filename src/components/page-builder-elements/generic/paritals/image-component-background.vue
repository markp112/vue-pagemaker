<template>
  <section>
    <div
      ref="imageContainer"
      class="handle object-contain "
      :id="$props.thisComponent.ref"
      @click.prevent="onClick($event)"
    >
      <img
        ref="imageElmnt"
        class="absolute bg-no-repeat "
        :style="getImageStyles()"
        :class="{ 'cursor-pan': draggingStarted }"
        @mousedown="onDraggingStarted($event)"
        @mouseup="onDraggingStop($event)"
      />
      <resizeable
        :isActive="isActive"
        :parentContainerDimensions="$props.thisComponent.parent.boxDimensions"
        @resizeStarted="resizeStarted($event)"
        @onResize="resizeImage($event)"
      >
      </resizeable>

      <div
        v-if="isActive"
        class=" bg-site-secondary-light bg-opacity-50 h-10 w-84 absolute bottom-0 left-0 right-0 mr-auto ml-auto flex flex-row justify-center p-1 z-50 "
      >
        <img
          :src="getPath('arrow_bidirectional-32.png')"
          class="controlIcon"
          @click="zoom('out')"
        />
        <img
          :src="getPath('arrow_vertical-32.png')"
          class="controlIcon"
          @click="zoom($event, 'out')"
        />
        <img
          :src="getPath('resize2-32.png')"
          class="controlIcon"
          @click="zoom('zoomToFit')"
        />
        <img
          :src="getPath('zoom_out-32.png')"
          class="controlIcon"
          @click="zoom('out')"
        />
        <img
          :src="getPath('zoom_in-32.png')"
          class="controlIcon"
          @click="zoom('in')"
        />
        <img
          :src="getPath('50-32.png')"
          class="controlIcon"
          @click="zoom('50')"
        />
        <img
          :src="getPath('100-32.png')"
          class="controlIcon"
          @click="zoom('100')"
        />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import {
  GenericComponentMixins,
  MousePosition
} from "../mixins/generic-components-mixin";
import Resize from "@/components/base/resizeable/resize.vue";
import { ImageElement } from "@/classes/page-element/page-components/image-element/ImageElement";
import Component, { mixins } from "vue-class-component";
import { PageModule } from "@/store/page/page";
import { ClientCoordinates } from "@/models/components/components";
import {
  ImageManipulator,
  ZoomDirection
} from "@/classes/images/image-manipulation/imageManipulation";
import { Style } from "@/models/styles/styles";
import { PageElementBuilder } from "@/classes/page-element/page-element-builder/PageElementBuilder";

@Component({
  props: {
    thisComponent: {
      default: (): ImageElement => {
        return new PageElementBuilder().buildAnImage();
      }
    }
  },
  components: {
    resizeable: Resize
  }
})
export default class ImageComponentBackground extends mixins(
  GenericComponentMixins
) {
  name = "ImageComponentBackground";
  HTML_IMAGE_ELEMENT = "imageElmnt";
  HTML_IMAGE_PARENT = "imageContainer";
  draggingStarted = false;
  isResizing = true;
  // isZoomed = false;
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
    this.parentContainer.setAttribute("style", styles);
    this.imageManipulator = new ImageManipulator(imageElement);
    styles = this.getImageStyles();
    this.image.setAttribute("style", styles);
  }

  get getData(): string {
    const component: ImageElement = this.$props.thisComponent;
    if (component) {
      return component.content;
    }
    return "";
  }

  get isActive(): boolean {
    return PageModule.selectedComponent === this.$props.thisComponent.ref;
  }

  getImageStyles(): string {
    return (this.component as ImageElement).getStyles();
  }

  onClick(event: Event) {
    event.stopPropagation();
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
    window.addEventListener("mousemove", this.panImage);
    window.addEventListener("mouseup", this.onDraggingStop);
  }

  onDraggingStop(event: MouseEvent) {
    this.draggingStarted = false;
    window.removeEventListener("mousemove", this.panImage);
    window.removeEventListener("mouseup", this.onDraggingStop);
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
    const target = this.$refs[this.HTML_IMAGE_PARENT] as HTMLDivElement;
    const lastMousePosition = {
      x: event.pageX - target.offsetLeft,
      y: event.pageY - target.offsetTop
    };
    this.imageManipulator.lastMousePosition = lastMousePosition;
  }

  resizeImage(boxProperties: ClientCoordinates) {
    const currentMousePosition: MousePosition = this.getMousePosition(
      boxProperties.clientX,
      boxProperties.clientY,
      this.HTML_IMAGE_PARENT
    );
    this.parentContainer.style.height =
      this.imageManipulator.imageElement.containerDimensions.height + "px";
    this.parentContainer.style.width =
      this.imageManipulator.imageElement.containerDimensions.width + "px";
  }

  zoom(direction: ZoomDirection) {
    const styles = this.imageManipulator.zoom(direction);
    styles.forEach((style: Style) => {
      PageModule.updateEditedComponentStyles(style);
    });
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
  @apply ml-2;
}
</style>
