<template>
<div class="relative">
  <div class="w-full bg-blue-500 h-24 "   :class="{'border': showBorder}"
      :ref="$props.reference"
      :id="$props.reference"
      @dragover.prevent
      @drop.prevent="onDrop"
      @click="onClick()">
    <slot />

  </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import FormButton from '@/components/base/buttons/form-button.vue';
import { ComponentBuilder } from '@/classes/component-builder/component-builder';
import EditDeleteOption from '@/components/page-builder-elements/utility/edit-delete-options/edit-delete-options.vue';
import { Emit } from 'vue-property-decorator';

@Component({
  props:{
    // $store:{ default:null },
    reference:{ default:'nav-bar1' }
  },
  components: {
    'edit-delete-option': EditDeleteOption,
  }

})

export default class NavBarEditor extends Vue {

showBorder= false;

created() {
  this.showBorder = false;
  console.log("Store  = ", this.$props.$store)
}

@Emit('componentClicked')
onClick() {
  this.$store.dispatch('updateEditedComponentRef', this.$props.ref)
  this.$store.dispatch('updateShowEditDelete', true)
  this.showBorder = !this.showBorder;
  return
}

onDrop(event: DragEvent) {
  // const componentBuilder = new ComponentBuilder();
  //   console.log("event=", event)
  //   if(this.$store.getters.dragDropEventHandled) { return }
  //   if(event) {
  //     const componentId = componentBuilder.getComponentID(event);
  //     console.log("componentId", componentId)
  //     const instance = componentBuilder.buildComponent(componentId);
  //     console.log('%c⧭', 'color: #f2ceb6', instance)
  //     if(instance){
  //       if(event.target) {
  //         (this.$refs[this.$props.reference] as HTMLDivElement).appendChild(instance.$el);
  //         this.$store.dispatch('toggleDragDropEventHandled', true);
          
  //       }
  //     }
  //   }
  }

get editComponentRef() {
  console.log("this.Soter", this.$store.getters.editedComponentRef)
  return this.$store.getters.editedComponentRef;
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