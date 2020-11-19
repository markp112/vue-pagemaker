<template>
  <div
    class="absolute triangleTopRight z-30"
    :class ="{'active': $props.isActive, 'in-active': !$props.isActive}"
    @mousedown.stop.prevent="handleDown($event)"
    @mouseup="handleMouseUp($event)"
    @mousemove="handleMouseMove($event)">
  </div>    
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Vue, Emit, Prop } from 'vue-property-decorator';
import { BoxDimensions, ResizeDimensions } from '@/models/components/box-dimension';
import { ClientCoordinates } from '@/models/components/components';

@Component({
  props: {
    isActive: { default: false },
    location: { }
  }
})
export default class Resize extends Vue {
  name = "resize";
  isSizing = false;
  parentPadding = 0;

  handleMouseUp(event: MouseEvent) {
    this.isSizing = false;
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
  }

  handleDown(ev: MouseEvent) {
    if (!this.$props.isActive) return;
   if (!this.isSizing) {
     this.resizeStarted(ev);
   }
  }

  @Emit('resizeStarted')
  resizeStarted(ev: MouseEvent) {
      window.addEventListener('mousemove', this.handleMouseMove);
      window.addEventListener('mouseup', this.handleMouseUp);
      this.isSizing = true
  }

  @Emit('onResize')
  emitResize(clientCoordinates: ClientCoordinates): ClientCoordinates {
    return clientCoordinates;
  }

  handleMouseMove(ev: MouseEvent) {
    ev.stopPropagation;
    if (this.isSizing) { 
      const clientCoordinates: ClientCoordinates = {
        clientY: ev.pageY,
        clientX: ev.pageX,
        offsetWidth: (this.$el as HTMLDivElement).offsetWidth,
        offsetHeight: (this.$el as HTMLDivElement).offsetHeight,
      };
      this.emitResize(clientCoordinates);
    } 
  }

}
</script>

<style lang="postcss" scoped>

  .triangleTopRight, .TriangleBottomLeft {
    content: '';
    position: absolute;
    top: -6px;
    right: -1px;
    box-sizing: border-box;
    cursor: nwse-resize;
    width: 0;
    height: 0;
    text-indent: -9999px;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    border-left: 10px solid rgb(56, 55, 56);
    color: rgb(228, 210, 228);
    filter: invert(1);
    mix-blend-mode: difference;
  }

  .triangleTopRight {
    transform:rotate(315deg); 
  }

  .TriangleBottomLeft {
     transform:rotate(45deg);
  }
    
  .active {
    visibility: visible;
  }

  .in-active {
    visibility: hidden;
  }
</style>
