<template>
  <div class="handle" 
    v-if="!isImage"
    :style="getStyles()"
    :id="$props.thisComponent.ref"
    :class="getClasses()"
    @click.prevent="onClick($event)"
  >
    {{ data.content }}
    <resizeable
      :isActive="showBorder"
      :parentContainerDimensions="$props.thisComponent.parent.boxDimensions"
      @onResize="onResize"
    ></resizeable>
  </div>
  <div 
    v-else-if="isImage"
    class="handle" 
    :style="getStyles()"
    :id="$props.thisComponent.ref"
    :class="getClasses()"
    @click.prevent="onClick($event)"
  >
    <img
      :src="data.content"
      :style="getStyles()"
      class="h-full"
      @click.prevent="onClick($event)"
    />
    <resizeable
      :isActive="showBorder"
      :parentContainerDimensions="$props.thisComponent.parent.boxDimensions"
      @onResize="onResize"
    ></resizeable>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import 
  {
    Style,
    PageData,
    ComponentContainer,
    PageElement,
  } from '@/models/page/page';
import { ComponentTypes, initDimensions } from '@/models/components/components';
import { BoxDimensions, BoxDimensionsInterface } from '@/models/components/box-dimension';
import { PageModule } from '@/store/page/page';
import Resize,
  { ResizeDimensions } from '@/components/base/resizeable/resize.vue';
import UploadImage from '@/components/base/pickers/upload-image/upload-image.vue';

@Component({
  props: {
    thisComponent: {
      default: (): PageData => {
        return new PageElement();
      },
    },
  },
  components: {
    'upload-image': UploadImage,
    resizeable: Resize,
  },
})
export default class GenericComponent extends Vue {
  name = 'generic-component';
  showBorder = false;
  isImage = false;
  data: ComponentTypes;
  editorComponent = '';
  styles: Style[] = [];
  style = '';

  created() {
    this.data = this.$props.thisComponent.data;
    if (this.$props.thisComponent.type === 'image') {
      this.isImage = true;
    }
  }

  getClasses(): string {
    let componentClassSpec = this.$props.thisComponent.classDefinition;
    if (this.showBorder) {
      componentClassSpec += ' border1';
    }
    return componentClassSpec;
  }

  getStyles(): string {
    let style: string;
    const component: ComponentContainer = this.$props.thisComponent;
    style = '';
    this.styles = component.styles;
    if (this.styles.length > 0) {
      this.styles.forEach(element => {
        style += `${element.style}:${element.value};`;
      });
    }
    style += `${component.boxDimensions.heightAsStyle};${component.boxDimensions.widthAsStyle}`;
    return style;
  }

  onResize(newDimensions: ResizeDimensions | undefined) {
    if (newDimensions) {
      if (PageModule.editedComponentRef) {
        if (newDimensions.height !== undefined) {
          const boxDimensions: BoxDimensionsInterface = 
          { 
            height: { value: newDimensions.height, units: 'px' },
            width: { value: newDimensions.width, units: 'px' },
            top: { value: 0, units: 'px' },
            left: { value: 0, units: 'px' }
          }
          PageModule.updateBoxDimensionHeightandWidth(boxDimensions)
        }
      }
    }
  }

  onClick(event: Event) {
    event.stopPropagation();
    PageModule.updateEditedComponentRef(this.$props.thisComponent);
    PageModule.updateShowEditDelete(true);
    this.showBorder = !this.showBorder;
  }
}
</script>

<style lang="postcss" scoped>
.handle {
  position: relative;
  box-sizing: border-box;
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
  @apply shadow shadow-xl;
}

.component:hover {
  @apply bg-gray-200 bg-gray-600;
}
</style>
