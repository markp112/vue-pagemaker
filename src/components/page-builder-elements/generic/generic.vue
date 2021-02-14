<template>
  <text-component v-if="isText" :thisComponent="$props.thisComponent"></text-component>
  <image-component v-else-if="isImage" :thisComponent="$props.thisComponent"></image-component>
  <button-component v-else-if="isButton" :thisComponent="$props.thisComponent"></button-component>
  <div
    :ref="$props.thisComponent.ref"
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
      @resizeStarted="resizeStarted($event)"
      @onResize="onResize($event)"
    ></resizeable>
  </div>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import Resize from '@/components/base/resizeable/resize.vue';
import ImageComponentBackground from './paritals/image-component-background.vue';
import TextComponent from './paritals/text-component/text-component.vue';
import ButtonComponent from './paritals/button-component/button-component.vue';
import { PageModule } from '@/store/page/page';
import { GenericComponentMixins } from '@/components/page-builder-elements/generic/mixins/generic-components-mixin';
import { PageElement } from '@/classes/page-element/PageElement';
import { PageElementClasses } from '@/classes/page-element/factory/page-element-factory';

@Component({
  components: {
    resizeable: Resize,
    'image-component': ImageComponentBackground,
    'text-component': TextComponent,
    'button-component': ButtonComponent,
  }
})
export default class GenericComponent extends mixins(GenericComponentMixins) {
  name = 'generic-component';
  isImage = false;
  isText = false;
  isButton = false;
  editorComponent = '';
  style = '';
  HTML_TARGET_ELEMENT = '';

  created() {
    const pageElement: PageElementClasses = this.$props.thisComponent;
    if (pageElement) {
      pageElement.setDefaultStyle();
    }
    if (this.$props.thisComponent.type === 'image') {
      this.isImage = true;
      this.isText = false;
      this.isButton = false;
    }
    if (this.$props.thisComponent.type === 'text') {
      this.isImage = false;
      this.isText = true;
      this.isButton = false;
    }
    if (this.$props.thisComponent.type === 'button') {
      this.isImage = false;
      this.isText = false;
      this.isButton = true;
    }
    this.HTML_TARGET_ELEMENT = this.$props.thisComponent.ref;
  }

  get getData(): string | undefined {
    const component: PageElementClasses = this.$props.thisComponent;
    if (component) {
      return this.$props.thisComponent.content;
    }
    return '';
  }

  get isActive(): boolean {
    return (
      PageModule.selectedComponent ===
      (this.$props.thisComponent as PageElement).ref
    );
  }

  onClick(event: Event) {
    event.stopPropagation();
    PageModule.updateEditedComponentRef(this.$props.thisComponent);
    PageModule.updateShowEditDelete(true);
  }
}
</script>

<style lang='postcss' scoped>
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
