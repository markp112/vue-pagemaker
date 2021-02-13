import Vue from "vue";
import Component from "vue-class-component";
import { PageModule } from "@/store/page/page";
import {
  BoxDimensionsInterface,
  BoxProperties
} from "@/models/components/box-dimension";
import {
  PageElementClasses,
  PageElementFactory
} from "@/classes/page-element/factory/page-element-factory";
import { ClientCoordinates } from "@/models/components/components";

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
  name = "GenericComponentMixins";
  showBorder = false;
  lastMousePosition: MousePosition = {
    x: 0,
    y: 0
  };

  getPath(image: string): string {
    const path = require.context("@/assets/icons", false, /\.png$/);
    return path(`./${image}`);
  }

  getElementBoxProperties(htmlElement: string): BoxProperties {
    let element: HTMLDivElement | null = this.$refs[
      htmlElement
    ] as HTMLDivElement;
    if (!element) {
      element = document.getElementById(htmlElement) as HTMLDivElement;
    }
    const boundingRect: BoxProperties = {
      width: element.getBoundingClientRect().width,
      height: element.getBoundingClientRect().height,
      top: element.getBoundingClientRect().top,
      left: element.getBoundingClientRect().left
    };
    return boundingRect;
  }

  getStyleDimension(style: string): number {
    if (style === "") {
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
      height: { value: boundingRect.height + changeY, units: "px" },
      width: { value: boundingRect.width + changeX, units: "px" },
      top: { value: boundingRect.top, units: "px" },
      left: { value: boundingRect.left, units: "px" }
    };
  }

  public getMousePosition(
    x: number,
    y: number,
    targetElement: string
  ): MousePosition {
    const target = this.$refs[targetElement] as HTMLDivElement;
    return {
      x: x - target.offsetLeft,
      y: y - target.offsetTop
    };
  }

  resizeStarted(event: MouseEvent) {
    this.lastMousePosition = this.getMousePosition(
      event.pageX,
      event.pageY,
      this.$props.thisComponent.ref
    );
  }

  onResize(boxProperties: ClientCoordinates) {
    const thisComponent = this.$props.thisComponent;
    const boundingRect: BoxProperties | null = this.getElementBoxProperties(
      thisComponent.ref
    );
    if (boundingRect) {
      const currentMousePosition = this.getMousePosition(
        boxProperties.clientX,
        boxProperties.clientY,
        thisComponent.ref
      );
      const changeX = currentMousePosition.x - this.lastMousePosition.x;
      const changeY = currentMousePosition.y - this.lastMousePosition.y;
      this.lastMousePosition = currentMousePosition;
      const boxDimensions: BoxDimensionsInterface = this.calculateNewDimensions(
        boundingRect,
        changeY,
        changeX
      );
      if (thisComponent.isContainer) {
        const parentContainer = thisComponent.parent;
        const parentDimensions = parentContainer.boxDimensions;
        const offSetWidth = boxProperties.offsetWidth;
        if (
          boxDimensions.width.value + offSetWidth >
            parentDimensions.width.value
        ) {
          boxDimensions.width.value =
            parentDimensions.width.value - offSetWidth;
        }
      }
      PageModule.updateBoxDimensionHeightandWidth(boxDimensions);
    }
  }

  getStyles(): string {
    let style = "";
    const component: PageElementClasses = this.$props.thisComponent;
    if (component) {
      style = component.getStylesToString();
      console.log('%c%s', 'color: #731d1d', style);
    }
    return style;
  }

  getClasses(): string {
    let componentClassSpec: string = this.$props.thisComponent.classDefinition;
    if (this.showBorder) {
      componentClassSpec += " border1";
    }
    return componentClassSpec;
  }
}
