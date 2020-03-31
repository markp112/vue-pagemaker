<template>
  <div class="w-full bg-blue-500 h-24"   :class="{'border': showBorder}"
      ref="nav-bar"
      id="nav-bar"
      @dragover.prevent
      @drop.prevent="onDrop"
      @click="onClick()">
    <slot />
  </div>

</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import FormButton from '@/components/base/buttons/form-button.vue';
@Component({
 
  props:{
    $store:{default:null}
  }

})

export default class NavBarEditor extends Vue {


showBorder= false;

created() {
  this.showBorder = false;
  console.log("Store  = ", this.$props.$store)
}


onClick() {
  this.showBorder = !this.showBorder;
}

onDrop(event: DragEvent) {
  console.log("this =", this)
  console.log("Store  = ", this.$store)
  console.log("Navbar event", event, this.$store.getters.dragDropEventHandled)
  
  if(this.$store.getters.dragDropEventHandled) { return }
  if(event) {
      const dataTransfer = event.dataTransfer;
      const componentId = dataTransfer ? dataTransfer.getData('text') : '';
      console.log("componentId", componentId)
      const instance: FormButton | undefined = this.getComponent(componentId);
      console.log('%c⧭', 'color: #f2ceb6', instance)
      if(instance){
        instance.$mount();
        console.log("got here")
        if(event.target) {
          (this.$refs['nav-bar'] as HTMLDivElement).appendChild(instance.$el);
          this.$store.dispatch('toggleDragDropEventHandled', true);
        }
      }
    }
  }

getComponent(componentId: string){
    switch(componentId) {
      case 'Navbutton': {
        const componentClass = Vue.extend(FormButton);
        const instance:FormButton  = new componentClass();
        instance.$mount();
        return instance;
      }
    }
  }

}
</script>

<style lang="postcss">
  .border {
    @apply border-red-600 border-8 border-dashed;
  }
</style>