<template>
  <div
    :class="getClasses()"
    @click="onClick($event)"
    :style="getStyles()"
    :id="$props.thisComponent.ref"
  >{{ $props.buttonLabel}}</div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Emit } from 'vue-property-decorator'
import { Style, ComponentRef, PageData, PageContainer } from '@/models/page/page'
@Component({
  props:{
    thisComponent:{ default: (): PageData => { return new PageContainer()}},
    buttonLabel: { default: 'test button' }
  }
})
export default class GenericComponent extends Vue {
  showBorder = false;

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