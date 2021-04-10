<template>
    <div
      :ref="$props.thisComponent.ref"
      :id="$props.thisComponent.ref"
      class="handle select-none"
      :class="getClass"
      :style="getStyles()"
      @click="onTextClick($event)"
      @mousedown="startDragText($event)"
      @mousemove="dragElement($event)"
      @mouseup="stopDragText($event)"
    >
      <text-data :content="this.$props.thisComponent.content"> </text-data>
      <resizeable
        :isActive="isTextActive"
        :parentContainerDimensions="$props.thisComponent.parent.boxDimensions"
        @resizeStarted="resizeStarted($event)"
        @onResize="onResize($event)"
      >
      </resizeable>
    </div>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component';
import Resize from '@/components/base/resizeable/resize.vue';
import TextData from './text-data.vue';
import { PageModule } from '@/store/page/page';
import { GenericComponentMixins } from '@/components/page-builder-elements/generic/mixins/generic-components-mixin';
import { TextElement } from '@/classes/page-element/page-components/text-element/TextElement';
import { PageElementBuilder } from '@/classes/page-element/page-element-builder/PageElementBuilder';
import { SidebarModule } from '@/store/sidebar/sidebar';

@Component({
  props: {
    thisComponent: {
      default: (): TextElement => {
        return new PageElementBuilder().buildATextElement();
      }
    }
  },
  components: {
    resizeable: Resize,
    'text-data': TextData
  }
})
export default class TextComponent extends mixins(GenericComponentMixins) {
  name = 'textComponent';

  created() {
    if (this.$props.thisComponent.styles.length === 0) {
      this.$props.thisComponent.setDefaultStyle();
    }
  }

  get getData(): string {
    return this.$props.thisComponent.content;
  }

  get isTextActive(): boolean {
    return PageModule.selectedComponent === this.$props.thisComponent.ref;
  }

  get getClass(): string {
    return this.$props.thisComponent.classDefinition;
  }

  onTextClick(event: Event) {
    event.stopPropagation();
    PageModule.updateEditedComponentRef(this.$props.thisComponent);
    SidebarModule.updateSidebarEditor(false);
    PageModule.updateShowEditDelete(true);
  }

  stopDragText(event: MouseEvent) {
    event.stopPropagation();
    const componentToDrag = this.$refs[this.$props.thisComponent.ref] as HTMLDivElement;
    this.stopDrag(event, componentToDrag);
  }
  
  startDragText(event: MouseEvent) {
    event.stopPropagation();
    const componentToDrag = this.$refs[this.$props.thisComponent.ref] as HTMLDivElement;
    this.startDrag(event, componentToDrag);
  }
}
</script>

<style lang="postcss" scoped>
.handle {
  position: relative;
  box-sizing: border-box;
}
</style>
