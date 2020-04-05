<template>
  <div
    class="inline-block  p-2 cursor-pointer" 
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
  }
})
export default class GenericComponent extends Vue {
  showBorder = false;
  classes ="component"

created() {
  this.classes ="border-red-4";
}

  getClasses(): string {
    console.log("getClasses called")
    let componentClassSpec = "shadow shadow-xl hover:bg-red-200"
    if(this.showBorder) {
      componentClassSpec += ' border'
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
  .border {
    @apply border-red-600 border border-dashed;
  }
  
</style>