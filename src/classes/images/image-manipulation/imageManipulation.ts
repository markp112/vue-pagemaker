import { PageContainer } from '@/classes/page-element/PageContainer/PageContainer';
import { BoxProperties, BoxDimensionsInterface } from '@/models/components/box-dimension';

export interface MousePostion {
  x: number,
  y: number,
}

export class ImageManipulator {
  private _lastMousePosition: MousePostion = {
    x: 0,
    y: 0
  };

  private _imageBoundRect: BoxProperties;
  private _containerBoundingRect: BoxProperties;
  private _imageRef: string;
  private _parent: PageContainer;

  constructor(
    lastMousePosition: MousePostion,
    imageBoundingRectangle: BoxProperties,
    containerBoundingRectangle: BoxProperties,
    imageRef: string,
    parent: PageContainer) {
      this._lastMousePosition = lastMousePosition;
      this._imageBoundRect = imageBoundingRectangle;
      this._containerBoundingRect = containerBoundingRectangle;
      this._imageRef = imageRef;
      this._parent = parent;
    }


  public reSizeContainers(currentMousePosition: MousePostion): BoxDimensionsInterface {
    const resizedDimensions = this.calculateNewDimensions(currentMousePosition);
    resizedDimensions.width.value = 
      this.checkWidthFitsWithinContainer(
        resizedDimensions.width.value
      );
    const constrainedDimensions = this.checkDimensionsRelativeToContainer(resizedDimensions);
    return constrainedDimensions;
  }


  private checkWidthFitsWithinContainer(width: number) {
    return this._parent.checkDimensionRelativeToContainerElements(
      this._imageRef, 
      width
    );
  }

  private checkDimensionsRelativeToContainer(dimensions: BoxDimensionsInterface): BoxDimensionsInterface {
    const checkedDimensions = dimensions;   
    if (this._imageBoundRect.top < this._containerBoundingRect.top) {
        checkedDimensions.top.value = this._containerBoundingRect.top;
    }
    if (dimensions.height.value > this._parent.boxDimensions.height.value) {
      checkedDimensions.height.value = this._parent.boxDimensions.height.value;
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