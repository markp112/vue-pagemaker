<template>
  <section>
    <span
      ref='resize-div'
      class="triangle top-right"
      :class="getClass"
      @mousedown.stop.prevent="handleDown($event)"
      @mouseup="handleMouseUp($event)"
      @mousemove="handleMouseMove($event)"
    >
    </span>
    <span
      ref='resize-div'
      class="triangle bottom-right"
      :class="getClass"
      @mousedown.stop.prevent="handleDown($event)"
      @mouseup="handleMouseUp($event)"
      @mousemove="handleMouseMove($event)"
    >
    </span>
    <span
      ref='resize-div'
      class="triangle top-left"
      :class="getClass"
      @mousedown.stop.prevent="handleDown($event)"
      @mouseup="handleMouseUp($event)"
      @mousemove="handleMouseMove($event)"
    >
    </span>
    <span
      ref='resize-div'
      class="triangle bottom-left"
      :class="getClass"
      @mousedown.stop.prevent="handleDown($event)"
      @mouseup="handleMouseUp($event)"
      @mousemove="handleMouseMove($event)"
    >
    </span>
  </section>
</template>

<script lang="ts">
import Component from "vue-class-component";
import { Vue, Emit } from "vue-property-decorator";
import { ClientCoordinates } from "@/models/components/components";

@Component({
  props: {
    isActive: { default: false },
    }
})
export default class Resize extends Vue {
  name = "resize";
  isSizing = false;
  parentPadding = 0;
  
  get getClass(): string {
    return this.$props.isActive ? 'active ' : 'in-active ';
  }

  handleMouseUp(event: MouseEvent) {
    event.stopPropagation;
    this.isSizing = false;
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("mouseup", this.handleMouseUp);
  }

  handleDown(ev: MouseEvent) {
    if (!this.$props.isActive) return;
    if (!this.isSizing) {
      this.resizeStarted(ev);
    }
  }

  @Emit("resizeStarted")
  resizeStarted(ev: MouseEvent) {
    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("mouseup", this.handleMouseUp);
    this.isSizing = true;
  }

  @Emit("onResize")
  emitResize(clientCoordinates: ClientCoordinates): ClientCoordinates {
    return clientCoordinates;
  }

  handleMouseMove(ev: MouseEvent) {
    ev.stopPropagation;
    if (this.isSizing) {
      const clientCoordinates: ClientCoordinates = {
        clientX: ev.screenX,
        clientY: ev.screenY,
        offsetWidth: (this.$el as HTMLDivElement).offsetWidth,
        offsetHeight: (this.$el as HTMLDivElement).offsetHeight
      };
      this.emitResize(clientCoordinates);
    }
  }
}
</script>

<style lang="postcss" scoped>
.triangle {
  box-sizing: border-box;
  
  z-index: 1;
  filter: invert(1);
  mix-blend-mode: difference;
  background-image: url('../../../assets/icons/triangle-top-left-24.png');

}

.bottom-right {
  right: -1px;
  bottom: -6px;
  cursor: nwse-resize;

}

.top-right {
  right: -1px;
  top: -6px;
  cursor: nesw-resize;
  transform: rotate(315deg);
}

.bottom-left {
  left: -1px;
  bottom: -6px;
  cursor: nesw-resize;
  transform: rotate(135deg);
}

.top-left {
  left: -1px;
  top: -6px;
  cursor: nwse-resize;
  transform: rotate(225deg);
}

.active {
  visibility: visible;
}

.in-active {
  visibility: hidden;
}
</style>
