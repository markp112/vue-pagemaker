<template>
  <div v-if="isText">
    <text-component :thisComponent="$props.thisComponent"></text-component>
  </div>
  <div v-else-if="isImage">
    <image-component :thisComponent="$props.thisComponent"></image-component>
  </div>
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
import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import Resize from '@/components/base/resizeable/resize.vue';
import { PageModule } from '@/store/page/page';
import { GenericComponentMixins } from '@/components/page-builder-elements/generic/mixins/generic-components-mixin';
import { SiteDefaults } from '@/classes/settings/site-defaults/site-defaults';
import { PageElement } from '@/classes/page-element/PageElement';
import { PageElementClasses } from '@/classes/page-element/factory/page-element-factory';
import ImageComponentBackground from './paritals/image-component-background.vue';
import TextComponent from './paritals/text-component/text-component.vue';

@Component({
  components: {
    resizeable: Resize,
    'image-component': ImageComponentBackground,
    'text-component': TextComponent,
  },
})
export default class GenericComponent extends mixins(GenericComponentMixins) {
  name = 'generic-component';
  isImage = false;
  isText = false;
  // data: ComponentTypes;
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
    }
    if (this.$props.thisComponent.type === 'text') {
      this.isImage = false;
      this.isText = true;
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
