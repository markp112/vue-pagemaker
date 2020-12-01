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
        class=" bg-site-secondary-light bg-opacity-50 h-10 w-84 absolute bottom-0 left-1/2 flex flex-row justify-center p-1 z-50 ">
        <img :src="getPath('arrow_bidirectional-32.png')" class="cursor-pointer z-30 h-8 w-8 ml-2" @click="zoom('out')">
        <img :src="getPath('arrow_vertical-32.png')" class=" z-30 h-8 w-8 ml-2" @click="zoom($event, 'out')">
        <img :src="getPath('resize2-32.png')" class=" z-30 h-8 w-8 ml-2" @click="zoom('out')">
        <img :src="getPath('zoom_out-32.png')" class=" z-30 h-8 w-8 ml-2" @click="zoom('out')">
        <img :src="getPath('zoom_in-32.png')" class=" z-30 h-8 w-8 ml-4" @click="zoom('in')">
        <img :src="getPath('50-32.png')" class=" z-30 h-8 w-8 ml-4" @click="zoom('50')">
        <img :src="getPath('100-32.png')" class="cursor-pointer z-30 h-8 w-8 ml-4" @click="zoom('100')">
      </div>
    </div>
</section>
</template>

<script lang="ts">
import Vue from 'vue'
import { GenericComponentMixins, MousePosition } from '../mixins/generic-components-mixin';
import Resize from '@/components/base/resizeable/resize.vue';
import { ImageElement } from '@/classes/page-element/page-components/image-element/ImageElement';
import Component, { mixins } from 'vue-class-component';
import { PageElementClasses } from '@/classes/page-element/factory/page-element-factory';
import { PageElementBuilder } from '@/classes/page-element/page-element-builder/PageElementBuilder';
import { PageModule } from '@/store/page/page';
import { BoxDimensionsInterface, BoxProperties, ResizeDimensions } from '@/models/components/box-dimension';
import { Units } from '@/models/enums/units/units';
import { ClientCoordinates, Dimensions } from '@/models/components/components';
import { Style } from '@/models/styles/styles';
import { Location } from '@/models/components/components'
import { PageContainer } from '@/classes/page-element/PageContainer/PageContainer';
import { ImageManipulator, ZoomDirection } from '@/classes/images/image-manipulation/imageManipulation';
import { Zoom } from '@/classes/images/image-manipulation/zoom';
import { Pan } from '@/classes/images/image-manipulation/pan';

@Component({
 props: {
    thisComponent: {
      default: (): PageElementClasses => {
        return undefined;
      },
    },
  },
  components: {
    resizeable: Resize,
  },
})
export default class ImageComponentBackground extends mixins(GenericComponentMixins) {
  name = 'ImageComponentBackground';
  HTML_IMAGE_ELEMENT = 'imageElmnt';
  HTML_IMAGE_PARENT = 'imageContainer';
  draggingStarted = false;
  isResizing = true;

  parentDimension = {
    height: 200,
    width: 100,
  };
  isZoomed = false;

  parentContainer: HTMLDivElement = this.$refs[this.HTML_IMAGE_PARENT] as HTMLDivElement;
  image: HTMLImageElement = new Image();
  component!: ImageElement;
  imageManipulator!: ImageManipulator;
  
  mounted() {
    this.parentContainer = this.$refs[this.HTML_IMAGE_PARENT] as HTMLDivElement;
    this.image = this.$refs[this.HTML_IMAGE_ELEMENT] as HTMLImageElement;
    let styles: string = this.getStyles();
    this.parentContainer.setAttribute('style', styles)
    this.component = this.$props.thisComponent;
    const imageElement = this.$props.thisComponent as ImageElement;
    this.imageManipulator = new ImageManipulator(imageElement);
    this.imageManipulator.imageRef = imageElement.ref;
    this.imageManipulator.parentContainer = imageElement.parent;

    // this.imageManipulator.location = imageElement.location;
    styles = this.getImageStyles();
    this.image.setAttribute('style', styles)
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
    let style = '';
    const styles: Style[] = this.$props.thisComponent.styles;
    if (styles.length > 0) {
      styles.forEach(element => {
        style += `${element.style}:${element.value};`;
      });
    }
    return style;
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
      y: event.pageY - parent.offsetTop,
    };
    this.imageManipulator.lastMousePosition = lastMousePosition;
    this.parentDimension.width = parseInt(parent.style.width);
    this.parentDimension.height = parseInt(parent.style.height);
    window.addEventListener('mousemove', this.panImage);
    window.addEventListener('mouseup', this.onDraggingStop);
  }

  onDraggingStop(event: MouseEvent) {
    this.draggingStarted = false;
    window.removeEventListener('mousemove', this.panImage);
    window.removeEventListener('mouseup', this.onDraggingStop);
  }

  panImage(event: MouseEvent) {
    if (!this.draggingStarted) {
      return false;
    }
    const currentMousePosition: MousePosition = this.getMousePosition(event.pageX, event.pageY, this.HTML_IMAGE_PARENT);
    const style = this.imageManipulator.pan(currentMousePosition);
    PageModule.updateEditedComponentStyles(style);

  }

  resizeStarted(event: MouseEvent) {
    const target = this.$refs[this.HTML_IMAGE_PARENT] as HTMLDivElement;
    const lastMousePosition = {
      x: event.pageX - target.offsetLeft,
      y: event.pageY - target.offsetTop,
    }
    console.log('%c⧭', 'color: #ffa280', this.imageManipulator)
    this.imageManipulator.lastMousePosition = lastMousePosition;
  }

  resizeImage(boxProperties: ClientCoordinates) {
    const currentMousePosition: MousePosition = this.getMousePosition(
      boxProperties.clientX,
      boxProperties.clientY,
      this.HTML_IMAGE_PARENT
    );
    const imageBoundingRectangle: BoxProperties = this.getElementBoxProperties(this.HTML_IMAGE_ELEMENT);
    this.imageManipulator.imageBoundingRect = imageBoundingRectangle;
    const parentRef = this.$props.thisComponent.parentRef;
    const containerBoundingRectangle: BoxProperties = this.getElementBoxProperties(parentRef);
    this.imageManipulator.containerBoundingRect = containerBoundingRectangle;
    const resizedDimensions = this.imageManipulator.resize(currentMousePosition);
    
    // PageModule.updateBoxDimensionHeightandWidth(resizedDimensions.boxDimensions);
    this.setElementHeightAndWidth(this.parentContainer);
    this.setElementHeightAndWidth(this.image);
    PageModule.updateEditedComponentStyles(resizedDimensions.style);
    
  }

  private setElementHeightAndWidth(target: HTMLElement) {
    target.style.height = this.imageManipulator.imageHeight + "px"; 
    target.style.width =  this.imageManipulator.imageWidth + "px"; 
  }

  zoom(direction: ZoomDirection) {
    const styles = this.imageManipulator.zoom(direction);
    styles.forEach(style => {
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

</style>