<template>
  <div :id="id"
        :draggable="draggable"
        @dragstart="onDragStart"
        @dragover.stop
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

  created() {
    this.id = this.$props.id;
  }

  onDragStart(e: DragEvent) {
    const target = e.target;
    if(e.currentTarget)    (e.currentTarget as HTMLDivElement).style.border ='dashed'; 
    if(e.dataTransfer) {
      if(e.target) {
        e.dataTransfer.setData('text/plain', (e.target as HTMLDivElement).id)
      }
      
    }
  }

}
</script>