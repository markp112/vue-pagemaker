<template>
  <div
    :class="getClasses()"
    @click="onClick($event)"
    :style="getStyles()"
    :id="$props.thisComponent.ref"
  >
  <span v-if="!isImage">{{ data.content }}</span>
  <img v-if="isImage" :src="data.content">
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Emit } from 'vue-property-decorator'
import { Style, ComponentRef, PageData, ComponentContainer, PageElement } from '@/models/page/page'
import { Content, ComponentTypes } from '@/models//components/components';

@Component({
  props:{
    thisComponent:{ default: (): PageData => { return new PageElement()}},
    buttonLabel: { default: 'test button' }
  }
})
export default class GenericComponent extends Vue {
  showBorder = false;
  isImage = false;
  data: ComponentTypes;


  created() {
    console.log("Created called")
    this.data = this.$props.thisComponent.data;
    if( this.$props.thisComponent.type === 'Image') this.isImage = true;
    console.log('%c⧭', 'color: #00e600', this.$props.thisComponent)
    console.log('%c%s', 'color: #f2ceb6', this.$props.thisComponent.type)
  }

  getClasses(): string {
    let componentClassSpec = this.$props.thisComponent.classDefinition;
    if(this.showBorder) {
      componentClassSpec += ' border1'
    }
    return componentClassSpec
  }

  getStyles(): string {
    let style: string;
    style = '';
    const styles: Style[] = this.$props.thisComponent.styles;
    if ( styles.length > 0 ){
      styles.forEach(element => {
          style += `${element.style}:${element.value};`
      });
    }
    return style;
  }

  onClick(event: Event){
    this.$store.dispatch('updateEditedComponentRef', this.$props.thisComponent);
    this.$store.dispatch('updateShowEditDelete', true);
    this.showBorder = !this.showBorder;
    event.stopPropagation();
  }
}
</script>
<style lang="postcss" scoped>
  .border1 {
    @apply border-indigo-800 border border-dashed;
  }
  
  .component {
    @apply shadow shadow-xl;
  }

  .component:hover {
     @apply bg-gray-200 bg-gray-600 ;
  }
</style>