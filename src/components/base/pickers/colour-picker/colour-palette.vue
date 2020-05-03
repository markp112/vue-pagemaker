<template>
  <canvas
    ref="canvasPalette"
    class="color-palette"
    width="200"
    height="200"
    @mousedown="onMouseDown($event)"
    @mousemove="onMouseMove($event)"
    @mouseup="onMouseUp($event)"
  >
  </canvas>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit, Watch } from 'vue-property-decorator';

@Component({
  props: {
    hue : { default: '#ffffff'},
  },
})
export default class ColourPalette extends Vue {
  name = 'colour-palette';
  colour = '#eeeeff';
  canvas?: HTMLCanvasElement;

  private ctx: CanvasRenderingContext2D | null = null;
  private mousedown = false;
  public selectedPosition?: { x: number; y: number };

  mounted() {
    this.canvas = this.$refs.canvasPalette as HTMLCanvasElement;
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
      this.draw();
    }
  }

  @Watch('$props.hue')
  onHueChange() {
    this.draw();
  }

  draw() {
    if (!this.ctx) {
      if(this.canvas) {
        this.ctx = this.canvas.getContext('2d');
      }
    }
    if (this.ctx && this.canvas) {
      const width = this.canvas.width;
      const height = this.canvas.height;
      this.ctx.fillStyle = this.$props.hue || 'rgba(255,255,255,1)';
      this.ctx.fillRect(0, 0, width, height);
      const whiteGrad = this.ctx.createLinearGradient(0, 0, width, 0);
      whiteGrad.addColorStop(0, 'rgba(255,255,255,1)');
      whiteGrad.addColorStop(1, 'rgba(255,255,255,0)');
      this.ctx.fillStyle = whiteGrad;
      this.ctx.fillRect(0, 0, width, height);
      const blackGrad = this.ctx.createLinearGradient(0, 0, 0, height);
      blackGrad.addColorStop(0, 'rgba(0,0,0,0)');
      blackGrad.addColorStop(1, 'rgba(0,0,0,1)');
      this.ctx.fillStyle = blackGrad;
      this.ctx.fillRect(0, 0, width, height);
      if (this.selectedPosition) {
        this.ctx.strokeStyle = 'white';
        this.ctx.fillStyle = 'white';
        this.ctx.beginPath();
        this.ctx.arc(this.selectedPosition.x, this.selectedPosition.y, 10, 0, 2 * Math.PI);
        this.ctx.lineWidth = 5;
        this.ctx.stroke();
      }
    }
  }

  onMouseUp(evt: MouseEvent) {
    this.mousedown = false;
  }

  onMouseDown(evt: MouseEvent) {
    this.mousedown = true;
    this.selectedPosition = { x: evt.offsetX, y: evt.offsetY };
    this.draw();
    this.emitColor(evt.offsetX, evt.offsetY);
  }

  onMouseMove(evt: MouseEvent) {
    if (this.mousedown) {
      this.selectedPosition = { x: evt.offsetX, y: evt.offsetY };
      this.draw();
      this.emitColor(evt.offsetX, evt.offsetY);
    }
  }

  @Emit('colour')
  emitColor(x: number, y: number) {
    const rgbaColor = this.getColorAtPosition(x, y);
    return rgbaColor;
  }

  getColorAtPosition(x: number, y: number) {
    if (this.ctx) {
      const imageData = this.ctx.getImageData(x, y, 1, 1).data;
      return 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
    }
  }
}

</script>

<style lang="postcss" scoped>
.color-palette:hover {
  cursor: pointer;
}

:host {
  width: 200px;
  height: 200px;
  display: block;
}
</style>