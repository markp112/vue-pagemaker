import Vue from 'vue';
import Component from 'vue-class-component';
import { PageModule } from '@/store/page/page';
import {
  ResizeDimensions,
  BoxDimensionsInterface,
} from '@/models/components/box-dimension';
import { ComponentContainer } from '@/models/page/page';
import { Style } from '@/models/styles/styles';

@Component
export class GenericComponentMixins extends Vue {
  name = "GenericComponentMixins";
  showBorder = false;

  onResize(newDimensions: ResizeDimensions | undefined) {
    if (newDimensions) {
      if (PageModule.editedComponentRef) {
        if (newDimensions.height !== undefined) {
          const boxDimensions: BoxDimensionsInterface = 
          { 
            height: { value: newDimensions.height, units: 'px' },
            width: { value: newDimensions.width, units: 'px' },
            top: { value: 0, units: 'px' },
            left: { value: 0, units: 'px' }
          }
          PageModule.updateBoxDimensionHeightandWidth(boxDimensions)
        }
      }
    }
  }
  
  getStyles(): string {
    let style = '';
    const component: ComponentContainer = this.$props.thisComponent;
    const styles: Style[] = component.styles;
    if (styles.length > 0) {
      styles.forEach(element => {
        style += `${element.style}:${element.value};`;
      });
    }
    style += `${component.boxDimensions.heightAsStyle};${component.boxDimensions.widthAsStyle}`;
    return style;
  }

  getClasses(): string {
    let componentClassSpec = this.$props.thisComponent.classDefinition;
    if (this.showBorder) {
      componentClassSpec += ' border1';
    }
    return componentClassSpec;
  }
}