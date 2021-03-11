<template>
  <div
    :ref="$props.thisComponent.ref"
    :style="getStyles()"
    :class="getClasses()"
    :id="$props.thisComponent.ref"
    class="handle flex flex-row justify-center items-center"
    @click.prevent="onButtonClick($event)"
    @mousedown="startDragButton($event)"
    @mousemove="dragElement($event)"
    @mouseup="stopDragButton($event)"
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
import Component, { mixins } from "vue-class-component";
import Resize from "@/components/base/resizeable/resize.vue";
import { PageModule } from "@/store/page/page";
import { GenericComponentMixins } from "@/components/page-builder-elements/generic/mixins/generic-components-mixin";
import { ButtonElement } from "@/classes/page-element/page-components/button-element/ButtonElement";
import { PageElementBuilder } from "@/classes/page-element/page-element-builder/PageElementBuilder";
import { SidebarModule } from "@/store/sidebar/sidebar";

@Component({
  props: {
    thisComponent: {
      default: (): ButtonElement => {
        return new PageElementBuilder().buildAButton();
      }
    }
  },
  components: {
    resizeable: Resize,
  }
})
export default class ButtonComponent extends mixins(GenericComponentMixins) {
  name = "buttonComponent";

  created() {
    this.$props.thisComponent.setDefaultStyle();
  }

  get isActive(): boolean {
    return (
      PageModule.selectedComponent ===
      (this.$props.thisComponent as ButtonElement).ref
    );
  }

  get getData(): string {
    return this.$props.thisComponent.content;
  }
  
  get getClass(): string {
    return this.$props.thisComponent.classDefinition;
  }

  onButtonClick(event: Event) {
    event.stopPropagation();
    PageModule.updateEditedComponentRef(this.$props.thisComponent);
    SidebarModule.updateSidebarEditor(false);
    PageModule.updateShowEditDelete(true);
  }
  
  stopDragButton(event: MouseEvent) {
    this.stopDrag(event);
  }
  
  startDragButton(event: MouseEvent) {
    this.startDrag(event);
  }
}
</script>

<style lang="postcss" scoped>
.handle {
  position: relative;
  box-sizing: border-box;
}
</style>
