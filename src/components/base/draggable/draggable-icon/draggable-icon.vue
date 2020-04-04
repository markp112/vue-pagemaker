<template>
  <div :id="id"
        :draggable="draggable"
        @dragstart="onDragStart"
        @dragover.stop
        @dragleave="onDragLeave"
        class="p-1 m-0"
      >
  <slot />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
  props: {
    id: { default:'' },
    draggable: { default:false }
  }
})
export default class DraggableIcon extends Vue {
  id!:string;

  created(): void {
    this.id = this.$props.id;
  }

  onDragStart(e: DragEvent): void {
    const target = e.target;
    if(e.currentTarget)    (e.currentTarget as HTMLDivElement).style.border ='dashed 0.5px'; 
    if(e.dataTransfer) {
      if(e.target) {
        e.dataTransfer.setData('text/plain', (e.target as HTMLDivElement).id);
        this.$store.dispatch('toggleDragDropEventHandled', false);
      }
    }
  }

  onDragLeave(e: DragEvent): void {
    const target = e.target;
    if(e.currentTarget)    (e.currentTarget as HTMLDivElement).style.border ='none'; 
  }

}
</script>