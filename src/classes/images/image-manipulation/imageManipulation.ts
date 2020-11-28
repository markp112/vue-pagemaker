import { PageContainer } from '@/classes/page-element/PageContainer/PageContainer';
import { BoxProperties, BoxDimensionsInterface } from '@/models/components/box-dimension';
import { Dimensions } from '@/models/components/components';
import { Style } from '@/models/styles/styles';

export interface MousePostion {
  x: number,
  y: number,
}

export class ImageManipulator {
  private _lastMousePosition: MousePostion = {
    x: 0,
    y: 0
  };
  
  private _imageBoundRect!: BoxProperties;
  private _containerBoundingRect!: BoxProperties;
  private _imageRef: string;
  private _parent: PageContainer | null = null;
  private _imageWidth = 100;
  private _imageHeight = 200;
  private _naturalSize!: Dimensions;

  constructor(imageRef: string) {
    this._imageRef = imageRef;
  }

  get imageHeight(): number {
    return this._imageHeight;
  }

  get imageWidth(): number {
    return this._imageWidth;
  }

  set imageBoundingRect(boundingRectangle: BoxProperties) {
    this._imageBoundRect = boundingRectangle;
  }

  set containerBoundingRect(boundingRectangle: BoxProperties) {
    this._containerBoundingRect = boundingRectangle;
  }

  set lastMousePosition(mousePosition: MousePostion) {
    this._lastMousePosition = mousePosition; 
  }

  set parentContainer(container: PageContainer) {
    this._parent = container;
  }

  set naturalSize(naturalSize: Dimensions) {
    this._naturalSize = naturalSize;
  }

  public reSizeContainers(currentMousePosition: MousePostion): BoxDimensionsInterface {
    const resizedDimensions = this.calculateNewDimensions(currentMousePosition);
    this._lastMousePosition = currentMousePosition;
    resizedDimensions.width.value = 
      this.checkWidthFitsWithinContainer(
        resizedDimensions.width.value
      );
    const constrainedDimensions = this.checkDimensionsRelativeToContainer(resizedDimensions);
    this._imageWidth = constrainedDimensions.width.value;
    this._imageHeight = constrainedDimensions.height.value;
    return constrainedDimensions;
  }

  public resizeImage(): Style {
    const backgroundSize = 'background-size'
    let style = {
      style: backgroundSize,
      value: `${this._imageWidth}px ${this._imageHeight}px`
    };
    if (this._naturalSize) {
      if (this._imageWidth > this._naturalSize.width) {
        style = {
          style: backgroundSize,
          value: `${this._imageWidth}px ${this._naturalSize.height}px`
        };
      } else if (this._imageWidth < this._naturalSize.width) {
        style = {
          style:backgroundSize,
          value: `${this._naturalSize.width}px ${this._naturalSize.height}px`
        };
      }
      
    }
    return style;
  }

  private checkWidthFitsWithinContainer(width: number) {
    if (this._parent) {
      return this._parent.checkDimensionRelativeToContainerElements(
        this._imageRef, 
        width
      );
    }
    return width;
  }

  private checkDimensionsRelativeToContainer(dimensions: BoxDimensionsInterface): BoxDimensionsInterface {
    const checkedDimensions = dimensions;   
    if (this._imageBoundRect.top < this._containerBoundingRect.top) {
        checkedDimensions.top.value = this._containerBoundingRect.top;
    }
    if (this._parent) {
      if (dimensions.height.value > this._parent.boxDimensions.height.value) {
        checkedDimensions.height.value = this._parent.boxDimensions.height.value;
      }
    }
    return checkedDimensions;
  }

  
  private calculateNewDimensions(currentMousePosition: MousePostion): BoxDimensionsInterface {
    const changeX = currentMousePosition.x - this._lastMousePosition.x;
    const changeY = currentMousePosition.y - this._lastMousePosition.y;
    return {
      height: { value: this._imageBoundRect.height + changeY, units: 'px' },
      width: { value: this._imageBoundRect.width + changeX, units: 'px' },
      top: { value: this._imageBoundRect.top, units: 'px' },
      left: { value: this._imageBoundRect.left, units: 'px' },
    };
  }
}