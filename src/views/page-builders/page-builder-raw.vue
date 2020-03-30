<template>
  <section>
    <p> {{title}} </p>
    <div :id="id" class="w-full bg-accent2 h-screen"
      ref="mainDiv"
      @dragover.prevent
      @drop.prevent="onDrop"
    >
      <slot />    
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import FormButton from '@/components/base/buttons/form-button.vue'
@Component({
  props:{
    id: {default: ''}
  },
  components:{
    'form-button': FormButton,
  }

})
export default class PageBuilder extends Vue {

  title!: string;

  created() {
    this.title = this.$route.params.title;
  }

  onDrop(e: DragEvent) {
    const dt = e.dataTransfer;
    console.log('%c⧭', 'color: #00a3cc', dt)

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