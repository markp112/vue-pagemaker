<template>
  <div
    class="absolute triangleTopRight"
    :class ="{'active': $props.isActive, 'in-active': !$props.isActive}"
    @mousedown.stop.prevent="handleDown($event)"
    @mouseup="handleMouseUp($event)"
    @mousemove="handleMove($event)">
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
    parentContainerDimensions: { 
      default: (): BoxDimensions => { return new BoxDimensions(
          { value: 0, units: 'px' },
          { value: 0, units: 'px' },
          { value: 0, units: 'px' },
          { value: 0, units: 'px' }
        )},
    },
  }
})
export default class Resize extends Vue {
  name = "resize";
  isSizing = false;
  parentPadding = 0;

  handleMouseUp(event: MouseEvent) {
    this.isSizing = false;
    window.removeEventListener('mousemove', this.handleMove);
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
      window.addEventListener('mousemove', this.handleMove);
      window.addEventListener('mouseup', this.handleMouseUp);
      this.isSizing = true
  }

  @Emit('onResize')
  emitResize(clientCoordinates: ClientCoordinates): ClientCoordinates {
    return clientCoordinates;
  }

  handleMove(ev: MouseEvent) {
    ev.stopPropagation;
    if (this.isSizing) { 
      const clientCoordinates = {
        clientY: ev.pageY,
        clientX: ev.pageX,
      };
      this.emitResize(clientCoordinates);
    } 
  }

  // calcNewDimensions(element: ClientCoordinates, clientX: number, clientY: number): ResizeDimensions {
  //   const parentDimensions: BoxDimensions = this.$props.parentContainerDimensions;
  //   const boxLeft = element.clientX + pageXOffset;
  //   const boxTop = element.clientY + pageYOffset;
  //   const resizeDimensions: ResizeDimensions = { height: 0, width: 0, }
  //   resizeDimensions.width = (clientX - boxLeft);
  //   resizeDimensions.height = (clientY - boxTop);
  //   return resizeDimensions;
  // }
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
