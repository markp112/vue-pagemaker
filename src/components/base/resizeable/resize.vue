<template>
  <div
      class="triangle"
      :class ="{'active': $props.isActive, 'in-active': !$props.isActive}"
      @mousedown.stop.prevent="handleDown($event)"
      @mouseup="handleMouseUp()"
      @mousemove="handleMove($event)">
  </div>    

</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Vue, Emit, Prop } from 'vue-property-decorator';

interface BoxProperties {
  width: number;
  height: number;
  top: number; 
  left: number;
  };

export interface ResizeDimensions {
  height: number;
  width: number;
}

@Component({
  props: {
    isActive: { default: false, }
  }
})
export default class Resize extends  Vue {
  name = "resize";
  isSizing = false;

getElementBoxProperties(): BoxProperties | null {
  const parent: HTMLDivElement | null = this.$el.parentElement as HTMLDivElement;
  // const boundingRect: BoxProperties = {
    
  //   width: this.$el.getBoundingClientRect().width,
  //   height: this.$el.getBoundingClientRect().height,
  //   top: this.$el.getBoundingClientRect().top,
  //   left: this.$el.getBoundingClientRect().left,
  // };
if (parent){
    const boundingRect: BoxProperties = {
    
    width: parent.getBoundingClientRect().width,
    height: parent.getBoundingClientRect().height,
    top: parent.getBoundingClientRect().top,
    left: parent.getBoundingClientRect().left,
  };
  return  boundingRect;
}
else return null
}

  handleMouseUp() {
    console.log("MouseUp")
    this.isSizing = false;
    window.removeEventListener('mousemove',() => {this.handleMove(event as MouseEvent)});
    window.removeEventListener('mouseup',() => {this.handleMouseUp()});
  }

  handleDown(ev: MouseEvent) {
    if (!this.$props.isActive) return;
    if(!this.isSizing) {
      window.addEventListener('mousemove', () => {this.handleMove(event as MouseEvent)});
      window.addEventListener('mouseup', () => {this.handleMouseUp()});
      this.isSizing = true
    }
  }
  @Emit('onResize')
  handleMove(ev: MouseEvent): ResizeDimensions | undefined {
    if(!this.isSizing) return undefined;
    const thisElement = this.getElementBoxProperties();
    if(thisElement){
      const boxLeft = thisElement.left + pageXOffset;
      const boxTop = thisElement.top += pageYOffset;
      const resizeDimensions: ResizeDimensions = { height: 0, width: 0 }
      resizeDimensions.width = (ev.clientX - boxLeft);
      resizeDimensions.height = (ev.clientY - boxTop);
      return resizeDimensions;
    } else return undefined;
  }
}
</script>


<style lang="postcss" scoped>

  .triangle {
    content: '';
    position: absolute;
    bottom: -6px;
    right: -1px;
    box-sizing: border-box;
    cursor: nwse-resize;
    width: 0;
    height: 0;
    text-indent: -9999px;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    border-left: 10px solid rgb(56, 55, 56);
    transform:rotate(45deg);
  }
    
  .active {
    visibility: visible;
  }

  .in-active {
    visibility: hidden;
  }
</style>