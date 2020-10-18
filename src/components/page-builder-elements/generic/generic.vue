<template>
  <div 
    ref="wrapperDiv"
    v-if="isText"
    :style="getStyles()"
    :id="$props.thisComponent.ref"
    class="handle" 
    :class="getClasses()"
    @click.prevent="onClick($event)"
  >
    <div v-html="getData"></div>
    <resizeable
      :isActive="isActive"
      :parentContainerDimensions="$props.thisComponent.parent.boxDimensions"
      @onResize="onResize($event)"
    >
    </resizeable>
  </div>
  <div 
    v-else-if="isImage"
    ref="imageContainer"
    class="handle relative image box-border" 
    :class="getClasses()"
    :style="getStyles()"
    :id="$props.thisComponent.ref"
    @click.prevent="onClick($event)"
  >
    <img
      ref="image"
      :src="getData"
      :style="getStyles()"
      class="object-contain w-auto absolute h-auto"
      :class="{'cursor-move': draggingStarted}"
      @click.prevent="onClick($event)"
      @mousemove="moveImage($event)"
      @mousedown="onDraggingStarted($event)"
      @mouseup="onDraggingStop($event)"

    />
    <resizeable
      :isActive="isActive"
      :parentContainerDimensions="$props.thisComponent.parent.boxDimensions"
      @onResize="onResize($event)"
    >
    </resizeable>
  </div>
  <div 
    v-else
    :style="getStyles()"
    :class="getClasses()"
    :id="$props.thisComponent.ref"
    class="handle flex flex-row justify-center items-center" 
    @click.prevent="onClick($event)"
  >
    {{ getData }}
    <resizeable
      :isActive="isActive"
      :parentContainerDimensions="$props.thisComponent.parent.boxDimensions"
      @onResize="onResize"
    ></resizeable>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import { PageData } from '@/models/page/page';
import { Style } from '@/models//styles/styles';
import {
  ComponentTypes,
  Dimensions,
  initDimensions,
} from '@/models/components/components';
import {
  BoxDimensions,
  BoxDimensionsInterface,
  Dimension,
  ResizeDimensions,
} from '@/models/components/box-dimension';
import Resize from '@/components/base/resizeable/resize.vue';
import { PageModule } from '@/store/page/page';
import { GenericComponentMixins } from '@/components/page-builder-elements/generic/mixins/generic-components-mixin';
import { SiteDefaults } from '@/classes/settings/site-defaults/site-defaults';
import { ComponentTypesString } from '@/models/components/base-component';
import { PageElement } from '@/classes/page-element/PageElement';
import { PageElementBuilder } from '@/classes/page-element/page-element-builder/PageElementBuilder';
import { PageElementClasses } from '@/classes/page-element/factory/page-element-factory';
import { ButtonElement } from '@/classes/page-element/page-components/button-element/ButtonElement';
import { ImageElement } from '@/classes/page-element/page-components/image-element/ImageElement';
import { Units } from '@/models/enums/units/units';

@Component({
  props: {
    thisComponent: {
      default: (): PageData => {
        return new PageElementBuilder().build();
      },
    },
  },
  components: {
    resizeable: Resize,
  },
})
export default class GenericComponent extends mixins(GenericComponentMixins) {
  name = 'generic-component';
  isImage = false;
  isText = false;
  data: ComponentTypes;
  editorComponent = '';
  style = '';
  draggingStarted = false;
  lastMousePosition = {
    x: 0,
    y: 0,
  }
 


  created() {
    const pageElement: PageElementClasses = this.$props.thisComponent;
    if (pageElement) {
      pageElement.setDefaultStyle();
    }
    if (this.$props.thisComponent.type === 'image') {
      this.isImage = true;
      this.isText = false;
    }
    if (this.$props.thisComponent.type === 'text') {
      this.isImage = false;
      this.isText = true;
    }
  }

  get getData(): string | undefined {
    const component: PageElementClasses = this.$props.thisComponent;
    if (component) {
      console.log('%c', 'color: #00736b', component, "Component")

        return (this.$props.thisComponent as ButtonElement).content;
    }
    return '';
  }

  get isActive(): boolean {
    return PageModule.selectedComponent === (this.$props.thisComponent as PageElement).ref;
  }

  onClick(event: Event) {
    event.stopPropagation();
    PageModule.updateEditedComponentRef(this.$props.thisComponent);
    PageModule.updateShowEditDelete(true);
  }

  onDraggingStarted(event: MouseEvent) {
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

  moveImage(event: MouseEvent) {
    if (!this.draggingStarted) {
      return
    }
    const parentContainer = this.$refs.imageContainer as HTMLDivElement;
    const image = this.$refs.image as HTMLImageElement;
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
  }
}
</script>

<style lang="postcss" scoped>
.handle {
  position: relative;
  box-sizing: border-box;
}

.image :active {
  @apply cursor-move;
}

.image {
  @apply cursor-default;
}
.active {
  visibility: visible;
}

.in-active {
  visibility: hidden;
}

.border1 {
  @apply border-indigo-800 border border-dashed;
}

.component {
  @apply shadow-xl;
}

.component:hover {
  @apply bg-gray-600;
}
</style>
