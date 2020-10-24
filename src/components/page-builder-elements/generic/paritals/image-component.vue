<template>
 
    <div class="relative w-auto h-full">
      <div 
        ref="imageContainer"
        class="handle relative image box-border" 
        :style="getStyles()"
        :id="$props.thisComponent.ref"
        @click.prevent="onClick($event)"
      >
        <img
          ref="imageElmnt"
          :src="getData"
          :style="getStyles()"
          class="absolute"
          :class="{'cursor-pan': draggingStarted}"
          @mousedown="onDraggingStarted($event)"
          @mouseup="onDraggingStop($event)"
          @click.prevent="onClick($event)"
       
        />
      <resizeable
        :isActive="isActive"
        :parentContainerDimensions="$props.thisComponent.parent.boxDimensions"
        @resizeStarted="resizeStarted($event)"
        @onResize="resizeImage($event)"
      >
      </resizeable>
    </div>
    </div>
  
</template>

<script lang="ts">
import Vue from 'vue'
import { GenericComponentMixins } from '../mixins/generic-components-mixin';
import Resize from '@/components/base/resizeable/resize.vue';
import { ImageElement } from '@/classes/page-element/page-components/image-element/ImageElement';
import Component, { mixins } from 'vue-class-component';
import { PageElementClasses } from '@/classes/page-element/factory/page-element-factory';
import { PageElementBuilder } from '@/classes/page-element/page-element-builder/PageElementBuilder';
import { PageModule } from '@/store/page/page';
import { BoxDimensionsInterface, ResizeDimensions } from '@/models/components/box-dimension';
import { Units } from '@/models/enums/units/units';
import { ClientCoordinates } from '@/models/components/components';


interface BoxProperties {
  width: number;
  height: number;
  top: number; 
  left: number;
};

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
  draggingStarted = false;
  isResizing = true;
  lastMousePosition = {
    x: 0,
    y: 0,
  };
  coordX = 0;
  coordY = 0;

  get getData(): string | undefined {
    const component: PageElementClasses = this.$props.thisComponent;
    if (component) {
      return this.$props.thisComponent.content;
    }
    return '';
  }

  get isActive(): boolean {
    return PageModule.selectedComponent === this.$props.thisComponent.ref;
  }

  onClick(event: Event) {
    event.stopPropagation();
    PageModule.updateEditedComponentRef(this.$props.thisComponent);
    PageModule.updateShowEditDelete(true);
  }

   onDraggingStarted(event: MouseEvent) {
    this.onClick(event);
    const parentContainer = this.$refs.imageContainer as HTMLDivElement;
    this.draggingStarted = true;
    this.lastMousePosition = {
      x: event.pageX - parentContainer.offsetLeft,
      y: event.pageY - parentContainer.offsetTop,
    }
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
    const parentContainer = this.$refs.imageContainer as HTMLDivElement;
    const image = this.$refs.imageElmnt as HTMLImageElement;
    const currentMousePosition = {
      x: event.pageX - parentContainer.offsetLeft,
      y: event.pageY - parentContainer.offsetTop,
    }
    const changeX = currentMousePosition.x - this.lastMousePosition.x;
    const changeY = currentMousePosition.y - this.lastMousePosition.y;
    this.lastMousePosition = currentMousePosition;
    const imageTop = image.style.top === "" ? 0 : parseInt(image.style.top, 10) ;
    const imageLeft = image.style.left === "" ? 0 : parseInt(image.style.left, 10);
    let imageTopNew = imageTop + changeY;
    let imageLeftNew = imageLeft + changeX;
    if (imageTopNew > 0 ) {
      imageTopNew = 0;
    }
    if (imageLeftNew > 0) {
      imageLeftNew = 0;
    }
    image.style.top = imageTopNew.toString() + "px";
    image.style.left = imageLeftNew.toString() + "px";
    (this.$props.thisComponent as ImageElement).location = {
      top: imageTopNew,
      left: imageLeftNew
    };
    return false;
  }


  resizeStarted(event: MouseEvent) {
    const parentContainer = this.$refs.imageContainer as HTMLDivElement;
    this.draggingStarted = true;
    this.lastMousePosition = {
      x: event.pageX - parentContainer.offsetLeft,
      y: event.pageY - parentContainer.offsetTop,
    }
  }

  resizeImage(boxProperties: ClientCoordinates) {
    const imageElement = this.$refs.imageElmnt as HTMLElement;
    const parentContainer = this.$refs.imageContainer as HTMLDivElement;
    const currentMousePosition = {
      x: boxProperties.clientX - parentContainer.offsetLeft,
      y: boxProperties.clientY - parentContainer.offsetTop,
    };
     const boundingRect: BoxProperties = {
      width: imageElement.getBoundingClientRect().width,
      height: imageElement.getBoundingClientRect().height,
      top: imageElement.getBoundingClientRect().top,
      left: imageElement.getBoundingClientRect().left,
    };
    const changeX = currentMousePosition.x - this.lastMousePosition.x;
    const changeY = currentMousePosition.y - this.lastMousePosition.y;
    this.lastMousePosition = currentMousePosition;
    const boxDimensions: BoxDimensionsInterface = {
      height: { value: boundingRect.height + changeY, units: 'px' },
      width: { value: boundingRect.width + changeX, units: 'px' },
      top: { value: boundingRect.top,  units: 'px' },
      left: { value: boundingRect.left, units: 'px' },
    };
    PageModule.updateBoxDimensionHeightandWidth(boxDimensions);

  }

  // xresizeImage(boxProperties: ClientCoordinates) {
  //   console.log('%c⧭', 'color: #cc7033', boxProperties)
  //   const imageElement = this.$refs.imageElmnt as HTMLElement;
  //   const boundingRect: BoxProperties = {
  //     width: imageElement.getBoundingClientRect().width,
  //     height: imageElement.getBoundingClientRect().height,
  //     top: imageElement.getBoundingClientRect().top,
  //     left: imageElement.getBoundingClientRect().left,
  //   };
  //   console.log('%c⧭', 'color: #607339', boundingRect)
  //   const boxLeft = boundingRect.left + pageXOffset;
  //   const boxTop = boundingRect.top + pageYOffset;
  //   const boxDimensions: BoxDimensionsInterface = {
  //     height: { value: boundingRect.height + (boxProperties.clientY - boxTop), units: 'px' },
  //     width: { value: boxProperties.clientX - boxLeft, units: 'px' },
  //     top: { value: boundingRect.top,  units: 'px' },
  //     left: { value: boundingRect.left, units: 'px' },
  //   };
  //   PageModule.updateBoxDimensionHeightandWidth(boxDimensions);
  // }
}
</script>

<style scoped>
.handle {
  position: relative;
  box-sizing: border-box;
}

</style>