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
    v-else-if="isImage">
    <image-component :thisComponent="$props.thisComponent"></image-component>
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
import ImageComponent from './paritals/image-component.vue';

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
    'image-component': ImageComponent,
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
        return this.$props.thisComponent.content;
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
