<template>
  <div>
    <div
      v-for="stick in sticks"
      :key="stick"
      class="handle-stick {'active': showBorder, 'in-active': !showBorder}"
      :class="['handle-stick-' + stick ] "
      :style="grabHandles(stick)">
      {{ stick }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';

type yTypes = 't' | 'm' | 'b';
type xTypes = 'l' | 'm' | 'r';
type handleStartPosType = 'mouseX' | 'mouseY' | 'x' | 'y' | 'w' | 'h';
type handleDirectionType = 'y' | 'x' | 'xy';

@Component({})
export default class Handles extends Vue {
  sticks = ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml']
  handleSize = 8;
  styleMapping = {
      y: {
          t: 'top',
          m: 'margin-top',
          b: 'bottom',
      },
      x: {
          l: 'left',
          m: 'margin-left',
          r: 'right',
      }
  };
  parentScaleX = 1;
  parentScaleY = 1;
  isActive = false;

  
  get grabHandles() {
    return (stick: string) => {
      const handleStyle = {
          width: `${this.handleSize / this.parentScaleX}px`,
          height: `${this.handleSize / this.parentScaleY}px`,
      };
      const firstLetter: yTypes = stick.charAt(0) as yTypes;
      const secondLetter: xTypes = stick.charAt(1) as xTypes; 
      const yStyle = `${this.styleMapping.y[firstLetter]}:${this.handleSize / this.parentScaleX / -2}px;`;
      const xStyle = `${this.styleMapping.x[secondLetter]}:${this.handleSize / this.parentScaleX / -2}px;`;
      return `height:${handleStyle.height}; width:${handleStyle.width};${yStyle}${xStyle}`;
      }
  }
}
</script>

<style lang="postcss" scoped>
.handle {
  position: relative;
  box-sizing: border-box;
}

.handle-stick {
    box-sizing: border-box;
    position: absolute;
    font-size: 1px;
    background: #ffffff;
    border: 1px solid #6c6c6c;
    box-shadow: 0 0 2px #bbb;
}

.inactive .handle-stick {
  display: none;
}

.handle-stick-tl, .handle-stick-br {
  cursor: nwse-resize;
}

.handle-stick-tm, .handle-stick-bm {
  left: 50%;
  cursor: ns-resize;
}

.handle-stick-tr, .handle-stick-bl {
  cursor: nesw-resize;
}

.handle-stick-ml, .handle-stick-mr {
  top: 50%;
  cursor: ew-resize;
}

.handle-stick.not-resizable{
  display: none;
}
 .active {
    visibility: visible;
  }

  .in-active {
    visibility: hidden;
  }.handle {
  position: relative;
  box-sizing: border-box;
}

.handle-stick {
    box-sizing: border-box;
    position: absolute;
    font-size: 1px;
    background: #ffffff;
    border: 1px solid #6c6c6c;
    box-shadow: 0 0 2px #bbb;
}

.inactive .handle-stick {
  display: none;
}

.handle-stick-tl, .handle-stick-br {
  cursor: nwse-resize;
}

.handle-stick-tm, .handle-stick-bm {
  left: 50%;
  cursor: ns-resize;
}

.handle-stick-tr, .handle-stick-bl {
  cursor: nesw-resize;
}

.handle-stick-ml, .handle-stick-mr {
  top: 50%;
  cursor: ew-resize;
}

.handle-stick.not-resizable{
  display: none;
}

.active {
  visibility: visible;
}

.in-active {
  visibility: hidden;
}
</style>
