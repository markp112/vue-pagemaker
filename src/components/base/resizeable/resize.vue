<template>
  <div
    class="absolute triangleTopRight"
    :class ="{'active': $props.isActive, 'in-active': !$props.isActive}"
    @mousedown.stop.prevent="handleDown($event)"
    @mouseup="handleMouseUp()"
    @mousemove="handleMove($event)">
  </div>    
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Vue, Emit, Prop } from 'vue-property-decorator';
import { BoxDimensions, ResizeDimensions } from '@/models/components/box-dimension';

interface BoxProperties {
  width: number;
  height: number;
  top: number; 
  left: number;
};

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

  getPaddingOnParent(element: HTMLDivElement): number {
    for (let index = 0; index < element.classList.length; index++) {
      if (element.classList[index].includes('p-')) {
        const padding = element.classList[index].substring(2);
        return Number(padding);
      }
    }
    return 0;
  }

  getElementBoxProperties(): BoxProperties | null {
    const parent: HTMLDivElement | null = this.$el.parentElement as HTMLDivElement;
    const parentContiner: HTMLDivElement = (parent as Node).parentNode as HTMLDivElement;
    // padding is in rems 4 = 1rem = 16px
    this.parentPadding = this.getPaddingOnParent(parentContiner) * 4;
    if (parent){
        const boundingRect: BoxProperties = {
        width: parent.getBoundingClientRect().width,
        height: parent.getBoundingClientRect().height,
        top: parent.getBoundingClientRect().top,
        left: parent.getBoundingClientRect().left,
      };
      return boundingRect;
    }
    else return null;
  }

  handleMouseUp(event: MouseEvent) {
    this.isSizing = false;
    window.removeEventListener('mousemove',() => { this.handleMove(event as MouseEvent) });
    window.removeEventListener('mouseup',() => { this.handleMouseUp(event as MouseEvent) });
  }

  handleDown(ev: MouseEvent) {
    console.log('%c%s', 'color: #e50000', 'handleDown')
    if (!this.$props.isActive) return;
    if (!this.isSizing) {
      window.addEventListener('mousemove', () => { this.handleMove(event as MouseEvent) });
      window.addEventListener('mouseup', () => { this.handleMouseUp(event as MouseEvent) });
      this.isSizing = true
    }
  }

  @Emit('onResize')
  handleMove(ev: MouseEvent): ResizeDimensions | undefined {
    if (this.isSizing) { 
      const thisElement: BoxProperties | null = this.getElementBoxProperties();
      if (thisElement) {
        const newDimensions: ResizeDimensions = this.calcNewDimensions(thisElement, ev.clientX, ev.clientY);
        return newDimensions;
      } 
    } 
    return undefined;
  }

  calcNewDimensions(element: BoxProperties, clientX: number, clientY: number): ResizeDimensions {
    const parentDimensions: BoxDimensions = this.$props.parentContainerDimensions;
    const boxLeft = element.left + pageXOffset;
    const boxTop = element.top + pageYOffset;
    const resizeDimensions: ResizeDimensions = { height: 0, width: 0, }
    resizeDimensions.width = (clientX - boxLeft);
    resizeDimensions.height = (clientY - boxTop);
    // if (resizeDimensions.width >= (parentDimensions.width.value - (this.parentPadding * 2))) {
    //   resizeDimensions.width = parentDimensions.width.value - (this.parentPadding * 2);
    // }
    // if (resizeDimensions.height > parentDimensions.top.value + parentDimensions.height.value) {
    //   resizeDimensions.height = parentDimensions.top.value + parentDimensions.height.value;
    // }
    return resizeDimensions;
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
