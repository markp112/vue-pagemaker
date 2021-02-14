<template>
    <div
      :ref="$props.thisComponent.ref"
      :id="$props.thisComponent.ref"
      class="handle select-none"
      :class="getClass"
      :style="getStyles()"
      @click.prevent="onTextClick($event)"
      @mousedown="startDrag($event)"
      @mousemove="dragElement($event)"
      @mouseup="stopDrag($event)"
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
import Component, { mixins } from "vue-class-component";
import Resize from "@/components/base/resizeable/resize.vue";
import TextData from "./text-data.vue";
import { PageModule } from "@/store/page/page";
import { GenericComponentMixins, MousePosition } from "@/components/page-builder-elements/generic/mixins/generic-components-mixin";
import { TextElement } from "@/classes/page-element/page-components/text-element/TextElement";
import { PageElementBuilder } from "@/classes/page-element/page-element-builder/PageElementBuilder";
import { MousePostion } from "@/classes/images/image-manipulation/imageManipulation";
import { Dimension } from "@/models/components/box-dimension";

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
    "text-data": TextData
  }
})
export default class TextComponent extends mixins(GenericComponentMixins) {
  name = "textComponent";
  top = 0;
  left = 0;

  created() {
    this.$props.thisComponent.setDefaultStyle();
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

  startDrag(event: MouseEvent) {
    this.$props.thisComponent.addClass('absolute');
    this.isDragging = true;
    this.lastMousePosition = { x: event.pageX, y: event.pageY };
    this.$props.thisComponent.isAbsolute = true;
    const textEditor = this.$refs[this.$props.thisComponent.ref] as HTMLDivElement;
    textEditor.classList.add('cursor-move');
  }

  stopDrag(event: MouseEvent): void {
    event.stopPropagation;
    this.isDragging = false;
    const textEditor = this.$refs[this.$props.thisComponent.ref] as HTMLDivElement;
    textEditor.classList.remove('cursor-move');
  }

  dragElement(event: MouseEvent) {
    if (!this.isDragging) return;
    event.stopPropagation;
    const currentMousePosition: MousePosition = { x: event.pageX, y: event.pageY };
    const deltaX = currentMousePosition.x - this.lastMousePosition.x;
    const deltaY = currentMousePosition.y - this.lastMousePosition.y;
    this.$props.thisComponent.boxDimensions.top.value += deltaY;
    this.$props.thisComponent.boxDimensions.left.value += deltaX;
    this.lastMousePosition.x = event.pageX;
    this.lastMousePosition.y = event.pageY;
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
