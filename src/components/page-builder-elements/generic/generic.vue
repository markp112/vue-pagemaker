<template>
  <div 
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
      @onResize="onResize"
    ></resizeable>
  </div>
  <div 
    v-else-if="isImage"
    class="handle" 
    :class="getClasses()"
    :style="getStyles()"
    :id="$props.thisComponent.ref"
    @click.prevent="onClick($event)"
  >
    <img
      :src="data.content"
      :style="getStyles()"
      class="h-full"
      @click.prevent="onClick($event)"
    />
    <resizeable
      :isActive="isActive"
      :parentContainerDimensions="$props.thisComponent.parent.boxDimensions"
      @onResize="onResize"
    ></resizeable>
  </div>
  <div 
    v-else
    :style="getStyles()"
    :id="$props.thisComponent.ref"
    class="handle" 
    :class="getClasses()"
    @click.prevent="onClick($event)"
  >
    {{ data.content }} btn
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
import 
  {
    PageData,
    ComponentContainer,
    PageElement,
    PageElementBuilder,
  } from '@/models/page/page';
import { Style } from '@/models//styles/styles';
import {
  ComponentTypes,
  initDimensions,
} from '@/models/components/components';
import {
  BoxDimensions,
  BoxDimensionsInterface,
} from '@/models/components/box-dimension';
import Resize from '@/components/base/resizeable/resize.vue';
import UploadImage from '@/components/base/pickers/upload-image/upload-image.vue';
import { PageModule } from '@/store/page/page';
import { GenericComponentMixins } from '@/components/page-builder-elements/generic/mixins/generic-components-mixin';

@Component({
  props: {
    thisComponent: {
      default: (): PageData => {
        return new PageElementBuilder().build();
      },
    },
  },
  components: {
    'upload-image': UploadImage,
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

  created() {
    this.data = this.$props.thisComponent.data;
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
    return this.$props.thisComponent.data.content;
  }

  get isActive(): boolean {
    return PageModule.selectedComponent === (this.$props.thisComponent as PageElement).ref;
  }

  onClick(event: Event) {
    event.stopPropagation();
    PageModule.updateEditedComponentRef(this.$props.thisComponent);
    PageModule.updateShowEditDelete(true);
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
