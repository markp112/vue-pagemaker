<template>
  <div
    class="inline-block w-auto p-2 h-8 cursor-pointer" 
    :class="{'border': showBorder}"
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
export default class BaseButton extends Vue {
  showBorder = false;

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