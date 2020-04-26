<template>
  
      <div
        :id="$props.thisComponent.ref"  
        v-if="!isImage"
        :class="getClasses()"
        :style="getStyles()"
        @click.prevent="onClick($event)"
      >{{ data.content }}</div>
      <img 
        :id="$props.thisComponent.ref"
        v-else-if="isImage" 
        :src="data.content" 
        :style="getStyles()"
        class="w-full h-full"
        @click.prevent="onClick($event)"
      />
  
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit } from 'vue-property-decorator';
import {
  Style,
  PageData,
  ComponentContainer,
  PageElement,
} from '@/models/page/page';
import {  ComponentRef } from '@/models/components/base-component';
import { Content, ComponentTypes } from '@/models//components/components';
import { BoxDimensions } from '@/models/components/box-dimension';
import { PageModule } from '@/store/page/page';
import { TriangleDirective } from '@/shared/directives/triangle/triangle';
import  Resize, { ResizeDimensions }  from '@/components/base/resizeable/resize.vue';
import UploadImage from '@/components/base/pickers/upload-image/upload-image.vue';

@Component({
  props: {
    thisComponent: {
      default: (): PageData => {
        return new PageElement();
      },
    },
  },

  components: {
    'upload-image': UploadImage,
    resizeable  : Resize,
  },
  directives :{
    'triangle-symbol': TriangleDirective
  },
})
export default class GenericComponent extends Vue {
  name = "generic-component";
  showBorder = false;
  isImage = false;
  data: ComponentTypes;
  editorComponent = '';
  styles: Style[] = [];
  style = '';
  parentContainerProps?: BoxDimensions;

  created() {
    this.data = this.$props.thisComponent.data;
    if (this.$props.thisComponent.type === 'image') { 
      this.isImage = true;
      
      const component = (this.$props.thisComponent as PageElement)
      component.classDefinition += ` ${component.parent.height()} `;
    }
  }

  getClasses(): string {
    let componentClassSpec = this.$props.thisComponent.classDefinition;
    if (this.showBorder) {
      componentClassSpec += ' border1';
    }
    console.log('%c%s', 'color: #d90000', componentClassSpec)
    return componentClassSpec;
  }

  getStyles(): string {
    let style: string;
    const component: ComponentContainer = this.$props.thisComponent;
    style = '';
    this.styles = component.styles;
    if (this.styles.length > 0) {
      this.styles.forEach(element => {
        style += `${element.style}:${element.value};`;
      });
    }
    style += `${component.boxDimensions.heightAsStyle};${component.boxDimensions.widthAsStyle}`;
    return style;
  }

  onResize(newDimensions: ResizeDimensions | undefined) {
    if (newDimensions) {
      if(PageModule.editedComponentRef) {
        if(newDimensions.height !== undefined) {
          // const styleH: Style = { style:'height', value: `${newDimensions.height}px`};
          // PageModule.editedComponentRef.addStyle(styleH)
          // const styleW: Style = { style:'width', value: `${newDimensions.width}px`};
          // PageModule.editedComponentRef.addStyle(styleW);
          this.style = `height:${newDimensions.height}px;width:${newDimensions.width}px;`;
          console.log('%c%s', 'color: #e50000', `height:${newDimensions.height}px;width:${newDimensions.width}px;`)
        }
      }
    }
  }

  onClick(event: Event) {
    event.stopPropagation();
    PageModule.updateEditedComponentRef(this.$props.thisComponent);
    PageModule.updateShowEditDelete(true);
    this.showBorder = !this.showBorder;
  }

}
</script>

<style lang="postcss" scoped>
  .handle {
    position: relative;
    box-sizing: border-box;
  }

.border1 {
  @apply border-indigo-800 border border-dashed;
}

.component {
  @apply shadow shadow-xl;
}

.component:hover {
  @apply bg-gray-200 bg-gray-600;
}
</style>