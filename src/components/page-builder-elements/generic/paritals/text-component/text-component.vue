<template>
  <section>
    <div 
      :ref="$props.thisComponent.ref"
      :id="$props.thisComponent.ref"
      class="handle" 
      :style="getStyles()"
      :class="getClasses()"
      @click.prevent="onTextClick($event)"
    >
      <text-data :data="this.$props.thisComponent.content"> </text-data>
      <resizeable
        :isActive="isTextActive"
        :parentContainerDimensions="$props.thisComponent.parent.boxDimensions"
        @resizeStarted="resizeStarted($event)"
        @onResize="onResize($event)"
      >
      </resizeable>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import Resize from '@/components/base/resizeable/resize.vue';
import  TextData  from './text-data.vue';
import { PageModule } from '@/store/page/page';
import { GenericComponentMixins } from '@/components/page-builder-elements/generic/mixins/generic-components-mixin';
import { PageElement } from '@/classes/page-element/PageElement';
import { PageElementClasses } from '@/classes/page-element/factory/page-element-factory';
import { TextElement } from '@/classes/page-element/page-components/text-element/TextElement';

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
    'text-data': TextData,
  },
})
export default class TextComponent extends mixins(GenericComponentMixins) {
  name = 'textComponent';
 
  created() {
    const pageElement: PageElement = this.$props.thisComponent;
    if (pageElement) {
      pageElement.setDefaultStyle();
    }
  }

  get getData(): string {
    const component: PageElement = this.$props.thisComponent;
    if (component) {
        return this.$props.thisComponent.content;
    }
    return '';
  }

  get isTextActive(): boolean {
    return PageModule.selectedComponent === this.$props.thisComponent.ref;
  }

  onTextClick(event: Event) {
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
</style>
