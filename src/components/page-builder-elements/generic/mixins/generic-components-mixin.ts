import Vue from 'vue';
import Component from 'vue-class-component';
import { PageModule } from '@/store/page/page';
import {
  BoxDimensionsInterface,
  BoxProperties
} from '@/models/components/box-dimension';
import {
  PageElementClasses,
  PageElementFactory
} from '@/classes/page-element/factory/page-element-factory';
import { ClientCoordinates } from '@/models/components/components';
import { PageElement } from '@/classes/page-element/PageElement';

export interface MousePosition {
  x: number;
  y: number;
}

@Component({
  props: {
    thisComponent: {
      default: (): PageElementClasses => {
        return new PageElementFactory().createElement();
      }
    }
  }
})
export class GenericComponentMixins extends Vue {
  name = 'GenericComponentMixins';
  showBorder = false;
  isDragging = false;
  lastMousePosition: MousePosition = {
    x: 0,
    y: 0
  };

  getPath(image: string): string {
    const path = require.context('@/assets/icons', false, /\.png$/);
    return path(`./${image}`);
  }

  getElementBoxProperties(htmlElement: string): BoxProperties {
    let element = this.$refs[htmlElement] as HTMLDivElement;
    if (!element) {
      element = document.getElementById(htmlElement) as HTMLDivElement;
    }
    const boundingRect: BoxProperties = {
      width: element.getBoundingClientRect().width,
      height: element.getBoundingClientRect().height,
      top: element.getBoundingClientRect().top,
      left: element.getBoundingClientRect().left,
    };
    return boundingRect;
  }

  getStyleDimension(style: string): number {
    if (style === '') {
      return 0;
    }
    return parseInt(style.substring(0, style.length - 2));
  }

  calculateNewDimensions(
    boundingRect: BoxProperties,
    changeY: number,
    changeX: number
    ): BoxDimensionsInterface {
    return {
      height: { value: boundingRect.height + changeY, units: 'px' },
      width: { value: boundingRect.width + changeX, units: 'px' },
      top: { value: boundingRect.top, units: 'px' },
      left: { value: boundingRect.left, units: 'px' }
    };
  }

  public getMousePosition(
    x: number,
    y: number,
  ): MousePosition {
    return {
      x: x ,
      y: y ,
    };
  }

  resizeStarted(event: MouseEvent) {
    this.lastMousePosition = this.getMousePosition(
      event.screenX,
      event.screenY,
    );
  }

  onResize(boxProperties: ClientCoordinates) {
    if (this.isDragging) return;
    const thisComponent = this.$props.thisComponent;
    const boundingRect: BoxProperties | null = this.getElementBoxProperties(
      thisComponent.ref
    );
    if (boundingRect) {
      const currentMousePosition = this.getMousePosition(
        boxProperties.clientX,
        boxProperties.clientY,
        );
      const changeX = currentMousePosition.x - this.lastMousePosition.x;
      const changeY = currentMousePosition.y - this.lastMousePosition.y;
      this.lastMousePosition = { ...currentMousePosition };
      const boxDimensions: BoxDimensionsInterface = this.calculateNewDimensions(
        boundingRect,
        changeY,
        changeX
        );
        // boxDimensions.left.value = this.$props.thisComponent.boxDimensions.left.value;
      if (thisComponent.isContainer) {
        const parentContainer = thisComponent.parent;
        const parentDimensions = parentContainer.boxDimensions;
        const offSetWidth = boxProperties.offsetWidth;
        if (
          boxDimensions.width.value + (offSetWidth * 2) >
            parentDimensions.width.value
        ) {
          boxDimensions.width.value =
            parentDimensions.width.value - ((offSetWidth * 2) + offSetWidth);
        }
      }
      PageModule.updateBoxDimensionHeightandWidth(boxDimensions);
    }
  }
  
  startDrag(event: MouseEvent, componentToDrag: HTMLDivElement) {
    this.$props.thisComponent.addClass('absolute');
    this.isDragging = true;
    this.lastMousePosition = { x: event.pageX, y: event.pageY };
    this.$props.thisComponent.isAbsolute = true;
    componentToDrag.classList.add('cursor-move');
    (this.$props.thisComponent as PageElement).addClass("z-50");
  }

  stopDrag(event: MouseEvent, componentToDrag: HTMLDivElement): void {
    event.stopPropagation;
    this.isDragging = false;
    componentToDrag.classList.remove('cursor-move');
    (this.$props.thisComponent as PageElement).removeClass("z-50");
  }

  dragElement(event: MouseEvent) {
    if (!this.isDragging) return;
    event.stopPropagation;
    const currentMousePosition: MousePosition = { x: event.pageX, y: event.pageY };
    const deltaX = currentMousePosition.x - this.lastMousePosition.x;
    const deltaY = currentMousePosition.y - this.lastMousePosition.y;
    this.$props.thisComponent.boxDimensions.top.value += deltaY;
    this.$props.thisComponent.boxDimensions.left.value += deltaX;
    this.lastMousePosition.x = event.pageX;
    this.lastMousePosition.y = event.pageY;
  }

  getStyles(): string {
    let style = '';
    const component: PageElementClasses = this.$props.thisComponent;
    if (component) {
      style = component.getStylesToString();
    }
    return style;
  }

  getClasses(): string {
    let componentClassSpec: string = this.$props.thisComponent.classDefinition;
    if (this.showBorder) {
      componentClassSpec += ' border1';
    }
    return componentClassSpec;
  }
}
