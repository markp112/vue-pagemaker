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
import { GenericComponentMixins, MousePosition } from '../mixins/generic-components-mixin';
import Resize from '@/components/base/resizeable/resize.vue';
import { ImageElement } from '@/classes/page-element/page-components/image-element/ImageElement';
import Component, { mixins } from 'vue-class-component';
import { PageElementClasses } from '@/classes/page-element/factory/page-element-factory';
import { PageElementBuilder } from '@/classes/page-element/page-element-builder/PageElementBuilder';
import { PageModule } from '@/store/page/page';
import { BoxDimensionsInterface, BoxProperties, ResizeDimensions } from '@/models/components/box-dimension';
import { Units } from '@/models/enums/units/units';
import { ClientCoordinates } from '@/models/components/components';
import { Style } from '@/models/styles/styles';
import { Location } from '@/models/components/components'

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
    const target = this.$refs[this.HTML_IMAGE_PARENT] as HTMLDivElement;
    this.draggingStarted = true;
    this.lastMousePosition = {
      x: event.pageX - target.offsetLeft,
      y: event.pageY - target.offsetTop,
    }
     window.addEventListener('mousemove', this.panImage);
     window.addEventListener('mouseup', this.onDraggingStop);
  }

  onDraggingStop(event: MouseEvent) {
    this.draggingStarted = false;
    window.removeEventListener('mousemove', this.panImage);
    window.removeEventListener('mouseup', this.onDraggingStop);
    const image = this.$refs[this.HTML_IMAGE_ELEMENT] as HTMLImageElement;
    const top: Style = { style:'top', value: image.style.top.toString() };
    const left: Style = { style:'left', value: image.style.left.toString() };
    PageModule.updateEditedComponentStyles(top);
    PageModule.updateEditedComponentStyles(left);
    
  }

  panImage(event: MouseEvent) {
    if (!this.draggingStarted) {
      return false;
    }
    const image = this.$refs[this.HTML_IMAGE_ELEMENT] as HTMLImageElement;
    const currentMousePosition: MousePosition = this.getMousePosition(event.pageX, event.pageY, this.HTML_IMAGE_PARENT);
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
    const target = this.$refs[this.HTML_IMAGE_PARENT] as HTMLDivElement;
    this.lastMousePosition = {
      x: event.pageX - target.offsetLeft,
      y: event.pageY - target.offsetTop,
    }
  }

  resizeImage(boxProperties: ClientCoordinates) {
    const currentMousePosition: MousePosition = this.getMousePosition(
      boxProperties.clientX,
      boxProperties.clientY,
      this.HTML_IMAGE_PARENT
    );
    const boundingRect: BoxProperties = this.getElementBoxProperties(this.HTML_IMAGE_ELEMENT);
    const changeX = currentMousePosition.x - this.lastMousePosition.x;
    const changeY = currentMousePosition.y - this.lastMousePosition.y;
    this.lastMousePosition = currentMousePosition;
    const boxDimensions: BoxDimensionsInterface = this.getBoxDimensions(
      boundingRect,
      changeY,
      changeX
    );
    PageModule.updateBoxDimensionHeightandWidth(boxDimensions);
  }
}
</script>

<style scoped>
.handle {
  position: relative;
  box-sizing: border-box;
}

</style>