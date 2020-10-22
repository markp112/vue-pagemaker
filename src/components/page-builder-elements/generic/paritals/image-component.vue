<template>
 
    <div class="relative w-auto h-auto">
      <div 
        ref="imageContainer"
        class="handle relative image box-border" 
        :class="getClasses()"
        :style="getStyles()"
        :id="$props.thisComponent.ref"
        @click.prevent="onClick($event)"
      >
        <img
          ref="imageElmnt"
          :src="getData"
          :style="getStyles()"
          class="object-contain absolute top-0 left-0"
          :class="{'cursor-pan': draggingStarted}"
          @click.prevent="onClick($event)"
          @mousemove="panImage($event)"
          @mousedown="onDraggingStarted($event)"
          @mouseup="onDraggingStop($event)"
        />
      <resizeable
        :isActive="isActive"
        :parentContainerDimensions="$props.thisComponent.parent.boxDimensions"
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
  }  

  get getData(): string | undefined {
    const component: PageElementClasses = this.$props.thisComponent;
    if (component) {
      
      console.log('%c%s', 'color: #735656', this.$props.thisComponent.content)
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
    console.log('%c%s', 'color: #ffcc00', 'onDraggingStarted')
    this.onClick(event);
    const parentContainer = this.$refs.imageContainer as HTMLDivElement;
    this.draggingStarted = true;
    this.lastMousePosition = {
      x: event.pageX - parentContainer.offsetLeft,
      y: event.pageY - parentContainer.offsetTop,
    }
  }

  onDraggingStop(event: MouseEvent) {
    this.draggingStarted = false;
  }

 
  
  panImage(event: MouseEvent) {
    if (!this.draggingStarted) {
      return
    }
    console.log('%c%s', 'color: #e5de73', 'moveImage')
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
    console.log('%c%s', 'color: #eeff00', imageTopNew)
    let imageLeftNew = imageLeft + changeX;
    console.log('%c%s', 'color: #73998c', imageLeftNew)
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
  }

  resizeImage(boxProperties: BoxProperties | undefined) {
    if (!boxProperties) return
    const imageElement = this.$refs.imageElmnt as HTMLElement;

    const boundingRect: BoxProperties = {
      width: imageElement.getBoundingClientRect().width,
          height: imageElement.getBoundingClientRect().height,
          top: imageElement.getBoundingClientRect().top,
          left: imageElement.getBoundingClientRect().left,
    };
       console.log('%c⧭', 'color: #00258c', boundingRect)
    const boxLeft = boundingRect.left + pageXOffset;
    const boxTop = boundingRect.top + pageYOffset;
    
    const boxDimensions: BoxDimensionsInterface = {
      height: { value: boxProperties.height - boxTop, units: 'px' },
      width: { value: boxProperties.width - boxLeft, units: 'px' },
      top: { value: 0, units: 'px' },
      left: { value: 0, units: 'px' },
    };
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