<template>
  <section>
    <div
      :ref="$props.thisComponent.ref"
      :id="$props.thisComponent.ref"
      class="handle cursor-move"
      :class="getClass"
      :style="getStyles()"
      @click.prevent="onTextClick($event)"
      @mousedown="startDrag($event)"
      @mousemove="moveElement($event)"
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
  </section>
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
  isMoving = false;
  lastMousePosition!: MousePosition;

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
    this.isMoving = true;
    this.lastMousePosition = this.getMousePosition(event.pageX, event.pageY, this.$props.thisComponent.ref);
  }

  moveElement(event: MouseEvent) {
    const currentMousePosition: MousePostion = this.getMousePosition(event.pageX, event.pageY, this.$props.thisComponent.ref);
    const deltaX = currentMousePosition.x - this.lastMousePosition.x;
    const deltaY = currentMousePosition.y - this.lastMousePosition.y;
    console.log('%c⧭', 'color: #007300', currentMousePosition)
    this.$props.thisComponent.boxDimensions.top.value += deltaY;
    this.$props.thisComponent.boxDimensions.left.value += deltaX;
    console.log('%c⧭', 'color: #807160', this.$props.thisComponent.boxDimensions.left.value)
    this.lastMousePosition = currentMousePosition;
    
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
