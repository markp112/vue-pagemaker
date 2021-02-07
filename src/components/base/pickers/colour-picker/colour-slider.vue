<template>
  <canvas
    ref="canvas"
    width="40"
    height="250"
    class="z-50"
    @mousedown="onMouseDown"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
  >
  </canvas>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Emit } from "vue-property-decorator";

@Component
export default class ColourSlider extends Vue {
  name = "colour-slider";
  canvas?: HTMLCanvasElement;

  private ctx: CanvasRenderingContext2D | null = null;
  private mousedown = false;
  private selectedHeight?: number;

  mounted() {
    this.canvas = this.$refs.canvas as HTMLCanvasElement;
    if (this.canvas) {
      this.ctx = this.canvas.getContext("2d");
      this.draw();
    }
  }

  draw() {
    if (!this.ctx) {
      if (this.canvas) {
        this.ctx = this.canvas.getContext("2d");
      }
    }
    if (this.ctx && this.canvas) {
      const width = this.canvas.width;
      const height = this.canvas.height;
      this.ctx.clearRect(0, 0, width, height);
      const gradient = this.ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "rgba(255, 0, 0, 1)");
      gradient.addColorStop(0.17, "rgba(255, 255, 0, 1)");
      gradient.addColorStop(0.34, "rgba(0, 255, 0, 1)");
      gradient.addColorStop(0.51, "rgba(0, 255, 255, 1)");
      gradient.addColorStop(0.68, "rgba(0, 0, 255, 1)");
      gradient.addColorStop(0.85, "rgba(255, 0, 255, 1)");
      gradient.addColorStop(1, "rgba(255, 0, 0, 1)");
      this.ctx.beginPath();
      this.ctx.rect(0, 0, width, height);
      this.ctx.fillStyle = gradient;
      this.ctx.fill();
      this.ctx.closePath();
      if (this.selectedHeight) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 3;
        this.ctx.rect(0, this.selectedHeight - 5, width, 8);
        this.ctx.stroke();
        this.ctx.closePath();
      }
    }
  }

  onMouseDown(evt: MouseEvent) {
    evt.stopPropagation();
    this.mousedown = true;
    this.selectedHeight = evt.offsetY;
    this.draw();
    this.emitColor(evt.offsetX, evt.offsetY);
  }

  onMouseMove(evt: MouseEvent) {
    if (this.mousedown) {
      this.selectedHeight = evt.offsetY;
      this.draw();
      this.emitColor(evt.offsetX, evt.offsetY);
    }
  }

  onMouseUp(evt: MouseEvent) {
    this.mousedown = false;
  }

  @Emit("colour")
  emitColor(x: number, y: number) {
    const rgbaColor = this.getColorAtPosition(x, y);
    return rgbaColor;
  }

  getColorAtPosition(x: number, y: number) {
    if (this.ctx) {
      const imageData = this.ctx.getImageData(x, y, 1, 1).data;
      return (
        "rgba(" + imageData[0] + "," + imageData[1] + "," + imageData[2] + ",1)"
      );
    }
  }
}
</script>
