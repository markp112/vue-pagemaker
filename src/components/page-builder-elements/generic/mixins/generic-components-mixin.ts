import Vue from 'vue';
import Component from 'vue-class-component';
import { PageModule } from '@/store/page/page';
import {
  BoxDimensionsInterface,
} from '@/models/components/box-dimension';
import { Style } from '@/models/styles/styles';
import { PageElementClasses, PageElementFactory } from '@/classes/page-element/factory/page-element-factory';
import { ClientCoordinates } from '@/models/components/components';

interface BoxProperties {
  width: number;
  height: number;
  top: number; 
  left: number;
};

export interface MousePosition {
  x: number,
  y: number,
}


const componentProps = Vue.extend({
  props: {
    thisComponent: {
      default: (): PageElementClasses=> {
        return new PageElementFactory().createElement();
      },
    },
  }
})

@Component ({
  props: {
    thisComponent: {
      default: (): PageElementClasses=> {
        return new PageElementFactory().createElement();
      },
    },
  },
})
export class GenericComponentMixins extends Vue {
  name = "GenericComponentMixins";
  // HTML_TARGET_ELEMENT = '';
  showBorder = false;
  lastMousePosition: MousePosition = {
    x: 0,
    y: 0,
  };

  getElementBoxProperties(htmlElement: string): BoxProperties {
    const element: HTMLDivElement | null = this.$refs[htmlElement] as HTMLDivElement;
    const boundingRect: BoxProperties = {
      width: element.getBoundingClientRect().width,
      height: element.getBoundingClientRect().height,
      top: element.getBoundingClientRect().top,
      left: element.getBoundingClientRect().left,
      };
    return boundingRect;
  }

  getBoxDimensions(
    boundingRect: BoxProperties,
    changeY: number,
    changeX: number,
    ): BoxDimensionsInterface {
    return {
      height: { value: boundingRect.height + changeY, units: 'px' },
      width: { value: boundingRect.width + changeX, units: 'px'},
      top: { value: boundingRect.top, units: 'px' },
      left: { value: boundingRect.left, units: 'px' },
    }
  }

  public getMousePosition(x: number, y: number, targetElement: string): MousePosition {
    const target = this.$refs[targetElement] as HTMLDivElement;
    return {
      x: x - target.offsetLeft,
      y: y - target.offsetTop,
    };
  }

  resizeStarted(event: MouseEvent) {
    this.lastMousePosition = this.getMousePosition(event.pageX, event.pageY, this.$props.thisComponent.ref)
  }

  onResize(boxProperties: ClientCoordinates) {
    const boundingRect: BoxProperties | null = this.getElementBoxProperties(this.$props.thisComponent.ref);
    if (boundingRect) {
      const currentMousePosition = this.getMousePosition(
        boxProperties.clientX,
        boxProperties.clientY,
        this.$props.thisComponent.ref
      );
      const changeX = currentMousePosition.x - this.lastMousePosition.x;
      const changeY = currentMousePosition.y - this.lastMousePosition.y;
      this.lastMousePosition = currentMousePosition;
      const boxDimensions: BoxDimensionsInterface = this.getBoxDimensions(
        boundingRect,
         changeY,
         changeX
        );
      PageModule.updateBoxDimensionHeightandWidth(boxDimensions);
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