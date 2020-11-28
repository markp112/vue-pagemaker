<template>
<section>
  <div 
    ref="imageContainer"
    class="handle object-contain " 
    :id="$props.thisComponent.ref"
    @click.prevent="onClick($event)"
    :styles="getStyles()"
    
  >
    <img
      ref="imageElmnt"
      class="absolute bg-no-repeat w-full h-full"
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
        class=" bg-site-secondary-light bg-opacity-50 h-10 w-40 absolute bottom-0 left-1/2 flex flex-row justify-center p-1 z-50 ">
        <img :src="getPath('zoom_out-32.png')" class=" z-30 h-8 w-8 ml-2" @click="zoom($event, 'out')">
        <img :src="getPath('zoom_in-32.png')" class=" z-30 h-8 w-8 ml-4" @click="zoom($event, 'in')">
        <img :src="getPath('100-32.png')" class=" z-30 h-8 w-8 ml-4" @click="zoom($event, '100')">
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
import { ImageManipulator } from '@/classes/images/image-manipulation/imageManipulation';

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
export default class ImageComponent extends mixins(GenericComponentMixins) {
  name = 'ImageComponent';
  HTML_IMAGE_ELEMENT = 'imageElmnt';
  HTML_IMAGE_PARENT = 'imageContainer';
  draggingStarted = false;
  isResizing = true;
  imagePosition = {
    top: 0,
    left: 0,
  };
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
    this.imageManipulator = new ImageManipulator(this.$props.thisComponent.ref);
    this.imageManipulator.parentContainer = this.$props.thisComponent.parent;
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
    this.lastMousePosition = {
      x: event.pageX - parent.offsetLeft,
      y: event.pageY - parent.offsetTop,
    };
    this.parentDimension.width = parseInt(parent.style.width);
    this.parentDimension.height = parseInt(parent.style.height);
    window.addEventListener('mousemove', this.panImage);
    window.addEventListener('mouseup', this.onDraggingStop);
  }

  onDraggingStop(event: MouseEvent) {
    this.draggingStarted = false;
    window.removeEventListener('mousemove', this.panImage);
    window.removeEventListener('mouseup', this.onDraggingStop);
    const top: Style = { style: 'background-position-x', value: this.image.style.backgroundPositionX};
    const left: Style = { style: 'background-position-y', value: this.image.style.backgroundPositionY};
    PageModule.updateEditedComponentStyles(top);
    PageModule.updateEditedComponentStyles(left);
  }

  panImage(event: MouseEvent) {
    if (!this.draggingStarted) {
      return false;
    }
    // const image = this.$refs[this.HTML_IMAGE_ELEMENT] as HTMLImageElement;
    const currentMousePosition: MousePosition = this.getMousePosition(event.pageX, event.pageY, this.HTML_IMAGE_PARENT);
    const changeX = currentMousePosition.x - this.lastMousePosition.x;
    const changeY = currentMousePosition.y - this.lastMousePosition.y;
    this.lastMousePosition = currentMousePosition;
    
    const backgroundX = isNaN(parseInt(this.image.style.backgroundPositionX))  ? 0 : parseInt(this.image.style.backgroundPositionX)  + changeX;
    const backgroundY = isNaN(parseInt(this.image.style.backgroundPositionY)) ? 0 : parseInt(this.image.style.backgroundPositionY) + changeY;

    const style: Style = {style: 'background-position', value: `${backgroundX}px ${backgroundY}px`};
    PageModule.updateEditedComponentStyles(style);
    // this.image.style.backgroundPosition = `${backgroundX}px ${backgroundY}px`
  }

  resizeStarted(event: MouseEvent) {
    const target = this.$refs[this.HTML_IMAGE_PARENT] as HTMLDivElement;
    const lastMousePosition = {
      x: event.pageX - target.offsetLeft,
      y: event.pageY - target.offsetTop,
    }
    this.imageManipulator.lastMousePosition = lastMousePosition;
    this.imageManipulator.naturalSize = this.component.naturalSize;
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
    const resizedDimensions = this.imageManipulator.reSizeContainers(currentMousePosition);
    
    PageModule.updateBoxDimensionHeightandWidth(resizedDimensions);
    this.setElementHeightAndWidth(this.parentContainer);
    this.setElementHeightAndWidth(this.image);
    PageModule.updateEditedComponentStyles(this.imageManipulator.resizeImage());
    
  }

  private setElementHeightAndWidth(target: HTMLElement) {
    target.style.height = this.imageManipulator.imageHeight + "px"; //boxDimensions.height.value + "px";
    target.style.width =  this.imageManipulator. imageWidth + "px"; //boxDimensions.width.value + "px";
  }

  private imageResize(resizedDimensions: BoxDimensionsInterface) {
    let naturalSize: Dimensions = {width: 10000, height: 1000, units: Units.px }
    const width = this.image.width;
    const height = this.image.height;
    if (this.component) {
      naturalSize = this.component.naturalSize;
    }
    if (!this.isZoomed) {
      this.image.style.backgroundPosition = `${0}px ${0}px`;
      if (resizedDimensions.width.value > naturalSize.width) {
        this.image.style.backgroundSize = `${width}px  ${naturalSize.height}px`
      } else if (resizedDimensions.width.value < naturalSize.width) {
        this.image.style.backgroundSize = `${naturalSize.width}px  ${naturalSize.height}px`
      }
    } else {
      this.image.style.backgroundSize = `${width}px  ${height}px`
    }
  }

  zoom(event: MouseEvent, direction: string) {
    const scale = 1.1; 
    const component = this.$props.thisComponent;
    const boxDimensions = component.boxDimensions;
    let newHeight = boxDimensions.height.value;
    let newWidth = boxDimensions.width.value;
    this.isZoomed = true;
    switch (direction) {
      case 'out':
        newHeight = boxDimensions.height.value / scale;
        newWidth = boxDimensions.width.value / scale;
        break;
      case 'in':
        newHeight = boxDimensions.height.value * scale;
        newWidth = boxDimensions.width.value * scale;
        break;
      case '100':
        newHeight = (component as ImageElement).naturalSize.height;
        newWidth = (component as ImageElement).naturalSize.width;
        break;
    }

    // boxDimensions.height.value = newHeight;
    // boxDimensions.width.value = newWidth;
    const theImage = this.$refs[this.HTML_IMAGE_ELEMENT] as HTMLImageElement;
    // this.setElementHeightAndWidth(theImage, boxDimensions);
    // this.imageResize(boxDimensions);
    
    this.image.style.backgroundSize = `${boxDimensions.width.value}px  ${boxDimensions.height.value}px`;
  }

}
</script>

<style scoped>
.handle {
  position: relative;
  box-sizing: border-box;
}

</style>