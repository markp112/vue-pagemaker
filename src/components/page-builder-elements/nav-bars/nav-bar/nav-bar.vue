<template>
  <div class="w-full bg-blue-500 h-48"   
      ref="nav-bar"
      @dragover.prevent
      @drop.prevent="onDrop">
    <slot />
  </div>

</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import FormButton from '@/components/base/buttons/form-button.vue';
@Component({
  components:{
    'form-button': FormButton,
  }
})

export default class NavBarEditor extends Vue {

onDrop(e: DragEvent) {
    const dt = e.dataTransfer;
    if(e){
      (e.currentTarget as HTMLDivElement).style.border ='dashed'
    if(dt){
      const componentId = dt.getData('text')
      const component = document.getElementById(componentId);
      (component as HTMLDivElement).style.border = 'none';
      const componentClass = Vue.extend(FormButton)
      const instance =  new componentClass({
        propsData: { label: 'primary' }
      });
      instance.$mount();

      if(component){
        component.style.display = "block";
        if(e.target){
          (e.target as HTMLDivElement).style.border ='none';
          (this.$refs.mainDiv as HTMLDivElement).appendChild(instance.$el)
          } 

      }
    }
    }
  }


}
</script>

<style lang="postcss">
  
</style>