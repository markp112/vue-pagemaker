import Vue from 'vue';
import Component from 'vue-class-component';
import { PageModule } from '@/store/page/page';
import {
  ResizeDimensions,
  BoxDimensionsInterface,
  BoxDimensions,
} from '@/models/components/box-dimension';
import { Style } from '@/models/styles/styles';
import { PageElementClasses } from '@/classes/page-element/factory/page-element-factory';
import { ClientCoordinates } from '@/models/components/components';

interface BoxProperties {
  width: number;
  height: number;
  top: number; 
  left: number;
};

@Component
export class GenericComponentMixins extends Vue {
  name = "GenericComponentMixins";
  showBorder = false;

  calcNewDimensions(element: BoxProperties, clientX: number, clientY: number): ResizeDimensions {
    const parentDimensions: BoxDimensions = this.$props.parentContainerDimensions;
    const boxLeft = element.left + pageXOffset;
    const boxTop = element.top + pageYOffset;
    const resizeDimensions: ResizeDimensions = { height: 0, width: 0, }
    resizeDimensions.width = (clientX - boxLeft);
    resizeDimensions.height = (clientY - boxTop);
    // if (resizeDimensions.width >= (parentDimensions.width.value - (this.parentPadding * 2))) {
    //   resizeDimensions.width = parentDimensions.width.value - (this.parentPadding * 2);
    // }
    // if (resizeDimensions.height > parentDimensions.top.value + parentDimensions.height.value) {
    //   resizeDimensions.height = parentDimensions.top.value + parentDimensions.height.value;
    // }
    return resizeDimensions;
  }
  getElementBoxProperties(): BoxProperties | null {
    const parent: HTMLDivElement | null = this.$el.parentElement as HTMLDivElement;
    // const parentContiner: HTMLDivElement = (parent as Node).parentNode as HTMLDivElement;
    // // padding is in rems 4 = 1rem = 16px
    // this.parentPadding = this.getPaddingOnParent(parentContiner) * 4;
    if (parent){
        const boundingRect: BoxProperties = {
          width: parent.getBoundingClientRect().width,
          height: parent.getBoundingClientRect().height,
          top: parent.getBoundingClientRect().top,
          left: parent.getBoundingClientRect().left,
      };
      return boundingRect;
    }
    else return null;
  }

  onResize(boxProperties: ClientCoordinates) {
    console.log('%c%s', 'color: #f27999',   'onResize');
    const boundingRect: BoxProperties | null = this.getElementBoxProperties();
    if (boundingRect) {
      const boxLeft = boundingRect.left + pageXOffset;
      const boxTop = boundingRect.top + pageYOffset;
      if (PageModule.editedComponentRef) {
          const boxDimensions: BoxDimensionsInterface = 
          { 
            height: { value: boxProperties.clientY - boxTop , units: 'px' },
            width: { value: boxProperties.clientX - boxLeft, units: 'px' },
            top: { value: 0, units: 'px' },
            left: { value: 0, units: 'px' }
          };
          PageModule.updateBoxDimensionHeightandWidth(boxDimensions)
        }
      }
    }

  getStyles(): string {
    let style = '';
    const component: PageElementClasses = this.$props.thisComponent;
    if (component) {
      const styles: Style[] = component.styles;
      if (styles.length > 0) {
        styles.forEach(element => {
          style += `${element.style}:${element.value};`;
        });
      }
      style += `${component.boxDimensions.heightAsStyle};${component.boxDimensions.widthAsStyle}`;
      console.log('%c⧭', 'color: #9c66cc', style);
    }
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