<template>
<section>
  <div 
    ref="imageContainer"
    class="handle overflow-hidden object-contain " 
    :id="$props.thisComponent.ref"
    @click.prevent="onClick($event)"
  >
    <img
      ref="imageElmnt"
      class="absolute"
      :src="getData"
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
  </div>
    <div class="w-full bg-site-secondary-light bg-opacity-50 h-10 absolute bottom-0 flex flex-row justify-center p-1 ">
      <img :src="getPath('zoom_out-32.png')" class=" z-30 h-8 w-8 ml-2" @click="zoom($event, 'out')">
      <img :src="getPath('zoom_in-32.png')" class=" z-30 h-8 w-8 ml-4" @click="zoom($event, 'in')">
      <img :src="getPath('100-32.png')" class=" z-30 h-8 w-8 ml-4" @click="zoom($event, '100')">
    </div>
</section>
</template>

// <script lang="ts">
// import Vue from 'vue'
// import { GenericComponentMixins, MousePosition } from '../mixins/generic-components-mixin';
// import Resize from '@/components/base/resizeable/resize.vue';
// import { ImageElement } from '@/classes/page-element/page-components/image-element/ImageElement';
// import Component, { mixins } from 'vue-class-component';
// import { PageElementClasses } from '@/classes/page-element/factory/page-element-factory';
// import { PageElementBuilder } from '@/classes/page-element/page-element-builder/PageElementBuilder';
// import { PageModule } from '@/store/page/page';
// import { BoxDimensionsInterface, BoxProperties, ResizeDimensions } from '@/models/components/box-dimension';
// import { Units } from '@/models/enums/units/units';
// import { ClientCoordinates } from '@/models/components/components';
// import { Style } from '@/models/styles/styles';
// import { Location } from '@/models/components/components'
// import { PageContainer } from '@/classes/page-element/PageContainer/PageContainer';
// import { faChalkboard } from '@fortawesome/free-solid-svg-icons';

// @Component({
//  props: {
//     thisComponent: {
//       default: (): PageElementClasses => {
//         return undefined;
//       },
//     },
//   },
//   components: {
//     resizeable: Resize,
//   },
// })
// export default class ImageComponent extends mixins(GenericComponentMixins) {
//   name = 'ImageComponent';
//   HTML_IMAGE_ELEMENT = 'imageElmnt';
//   HTML_IMAGE_PARENT = 'imageContainer';
//   draggingStarted = false;
//   isResizing = true;
//   lastMousePosition = {
//     x: 0,
//     y: 0,
//   };
//   imagePosition = {
//     top: 0,
//     left: 0,
//   };
//   parentDimension = {
//     height: 0,
//     width: 0,
//   };

//   parentContainer: HTMLDivElement = this.$refs[this.HTML_IMAGE_PARENT] as HTMLDivElement;
//   image: HTMLImageElement = new Image();

//   mounted() {
//     this.parentContainer = this.$refs[this.HTML_IMAGE_PARENT] as HTMLDivElement;
//     this.image = this.$refs[this.HTML_IMAGE_ELEMENT] as HTMLImageElement;
//     const styles: string = this.getStyles();
//     this.parentContainer.setAttribute('style', styles)
//     this.image.setAttribute('style', styles)
//   }

//   get getData(): string {
//     const component: PageElementClasses = this.$props.thisComponent;
//     if (component) {
//       return component.content;
//     }
//     return '';
//   }

//   get isActive(): boolean {
//     return PageModule.selectedComponent === this.$props.thisComponent.ref;
//   }

//   onClick(event: Event) {
//     event.stopPropagation();
//     PageModule.updateEditedComponentRef(this.$props.thisComponent);
//     PageModule.updateShowEditDelete(true);
//   }

//    onDraggingStarted(event: MouseEvent) {
//     this.onClick(event);
//     const parent = this.$refs[this.HTML_IMAGE_PARENT] as HTMLDivElement;
//     this.draggingStarted = true;
//     this.lastMousePosition = {
//       x: event.pageX - parent.offsetLeft,
//       y: event.pageY - parent.offsetTop,
//     };
//     this.parentDimension.width = parseInt(parent.style.width);
//     this.parentDimension.height = parseInt(parent.style.height);
//     window.addEventListener('mousemove', this.panImage);
//     window.addEventListener('mouseup', this.onDraggingStop);
//   }

//   onDraggingStop(event: MouseEvent) {
//     this.draggingStarted = false;
//     window.removeEventListener('mousemove', this.panImage);
//     window.removeEventListener('mouseup', this.onDraggingStop);
//     const top: Style = { style: 'top', value: this.imagePosition.top + 'px' };
//     const left: Style = { style: 'left', value: this.imagePosition.left + 'px' };
//     PageModule.updateEditedComponentStyles(top);
//     PageModule.updateEditedComponentStyles(left);
//   }

//   panImage(event: MouseEvent) {
//     if (!this.draggingStarted) {
//       return false;
//     }
//     const image = this.$refs[this.HTML_IMAGE_ELEMENT] as HTMLImageElement;
//     const currentMousePosition: MousePosition = this.getMousePosition(event.pageX, event.pageY, this.HTML_IMAGE_PARENT);
//     const changeX = currentMousePosition.x - this.lastMousePosition.x;
//     const changeY = currentMousePosition.y - this.lastMousePosition.y;
//     this.lastMousePosition = currentMousePosition;
//     this.imagePosition.top += changeY;
//     this.imagePosition.left += changeX;
//     image.style.top = this.imagePosition.top + "px";
//     image.style.left = this.imagePosition.left + "px";
//   }

//   resizeStarted(event: MouseEvent) {
//     const target = this.$refs[this.HTML_IMAGE_PARENT] as HTMLDivElement;
//     this.lastMousePosition = {
//       x: event.pageX - target.offsetLeft,
//       y: event.pageY - target.offsetTop,
//     }
//   }

//   resizeImage(boxProperties: ClientCoordinates) {
//     const currentMousePosition: MousePosition = this.getMousePosition(
//       boxProperties.clientX,
//       boxProperties.clientY,
//       this.HTML_IMAGE_PARENT
//     );
//     const boundingRect: BoxProperties = this.getElementBoxProperties(this.HTML_IMAGE_ELEMENT);
//     const parent: PageContainer = this.$props.thisComponent.parent;
//     const parentBoundingRect: BoxProperties = this.getElementBoxProperties(parent.ref);
//     const changeX = currentMousePosition.x - this.lastMousePosition.x;
//     const changeY = currentMousePosition.y - this.lastMousePosition.y;
//     this.lastMousePosition = currentMousePosition;
//     const boxDimensions: BoxDimensionsInterface = this.calculateNewDimensions(
//       boundingRect,
//       changeY,
//       changeX
//     );
//     const value = parent.checkDimensionRelativeToContainerElements(this.$props.thisComponent.ref, boxDimensions.width.value);
//     boxDimensions.width.value = value;
//     if (boundingRect.top < parentBoundingRect.top) {
//       boxDimensions.top.value = parentBoundingRect.top;
//     }
//     if (boxDimensions.height.value > parent.boxDimensions.height.value) {
//       boxDimensions.height.value = parent.boxDimensions.height.value;
//     }
//     PageModule.updateBoxDimensionHeightandWidth(boxDimensions);
//     this.setElementHeightAndWidth(this.parentContainer, boxDimensions);
//     this.setElementHeightAndWidth(this.image, boxDimensions);
//   }

//   private setElementHeightAndWidth(target: HTMLElement, boxDimensions: BoxDimensionsInterface) {
//     target.style.height = boxDimensions.height.value + "px";
//     target.style.width = boxDimensions.width.value + "px";
//   }

//   private imageResize( boxDimensions: BoxDimensionsInterface) {
//     const img = new Image();
//     img.src = this.image.src;
//     img.height = boxDimensions.height.value;
//     img.width = boxDimensions.width.value;
//     this.image.src = img.src;
//   }

//   zoom(event: MouseEvent, direction: string) {
//     const scale = 1.1; 
//     const component = this.$props.thisComponent;
//     const boxDimensions = component.boxDimensions;
//     let newHeight = boxDimensions.height.value;
//     let newWidth = boxDimensions.width.value;
//     switch (direction) {
//       case 'out':
//         newHeight = boxDimensions.height.value / scale;
//         newWidth = boxDimensions.width.value / scale;
//         break;
//       case 'in':
//         newHeight = boxDimensions.height.value * scale;
//         newWidth = boxDimensions.width.value * scale;
//         break;
//       case '100':
//         newHeight = (component as ImageElement).naturalSize.height;
//         newWidth = (component as ImageElement).naturalSize.width;
//         break;
//     }

//     boxDimensions.height.value = newHeight;
//     boxDimensions.width.value = newWidth;
//     const theImage = this.$refs[this.HTML_IMAGE_ELEMENT] as HTMLImageElement;
//     this.setElementHeightAndWidth(theImage, boxDimensions);
//     this.imageResize(boxDimensions);
//     const parent = this.$refs[this.HTML_IMAGE_PARENT] as HTMLDivElement;
//     const mouseX = event.x;
//     const mouseY = event.y;
//     const width = parseInt(parent.style.width);
//     const height = parseInt(parent.style.height);

//     parent.scrollLeft = width / -2 + (mouseX + theImage.offsetLeft) * scale;
//     parent.scrollTop  = height / -2 + (mouseY + theImage.offsetTop) * scale;

//   }

// }
// </script>

<style scoped>
.handle {
  position: relative;
  box-sizing: border-box;
}

</style>