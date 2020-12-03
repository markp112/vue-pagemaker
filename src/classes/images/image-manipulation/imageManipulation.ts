import { ImageElement } from '@/classes/page-element/page-components/image-element/ImageElement';
import { PageContainer } from '@/classes/page-element/PageContainer/PageContainer';
import { MousePosition } from '@/components/page-builder-elements/generic/mixins/generic-components-mixin';
import { BoxProperties, BoxDimensionsInterface } from '@/models/components/box-dimension';
import { Dimensions, Location } from '@/models/components/components';
import { Style } from '@/models/styles/styles';
import { Pan } from './pan';
import { Zoom } from './zoom';

export interface MousePostion {
  x: number,
  y: number,
}

export type ZoomDirection = 'in' | 'out' | '100' | '50';

export class ImageManipulator {
  private _lastMousePosition: MousePostion = {
    x: 0,
    y: 0
  };

  private _imageElement: ImageElement;

  constructor(imageElement: ImageElement) {
    this._imageElement = imageElement;
  }

  private _imageBoundRect!: BoxProperties;
  private _containerBoundingRect!: BoxProperties;
  private _imageRef = '';
  private _parent!: PageContainer;

  get imageRef(): string {
    return this._imageRef;
  }

  set imageRef(imageRef: string) {
    this._imageRef = imageRef
  }

  get imageHeight(): number {
    return this._imageElement.scaledSize.height;
  }

  get imageWidth(): number {
    return this._imageElement.scaledSize.width;
  }

  get imageBoundRect(): BoxProperties {
    return this._imageBoundRect
  }

  set imageBoundingRect(boundingRectangle: BoxProperties) {
    this._imageBoundRect = boundingRectangle;
  }

  get containerBoundingRect(): BoxProperties {
    return this._containerBoundingRect;
  }

  set containerBoundingRect(boundingRectangle: BoxProperties) {
    this._containerBoundingRect = boundingRectangle;
  }

  set lastMousePosition(mousePosition: MousePostion) {
    this._lastMousePosition.x = mousePosition.x;
    this._lastMousePosition.y = mousePosition.y; 
  }
  
  get parent(): PageContainer {
    return this._parent;
  }

  set parentContainer(container: PageContainer) {
    this._parent = container;
  }


  public resize(currentMousePosition: MousePostion): { boxDimensions: BoxDimensionsInterface, style: Style} {
    return {
      boxDimensions: this.reSizeContainers(currentMousePosition),
      style: this.resizeImage(),
    };
  }

  public zoom(direction: ZoomDirection): Style[] {
    const zoom: Zoom = new Zoom(
      this._imageElement.scaledSize,
      this._imageElement.naturalSize,
      this._imageElement.location
    );
    const dimensionLocation = zoom.zoom(direction);
    this._imageElement.scaledSize.height = dimensionLocation.dimensions.height;
    this._imageElement.scaledSize.width = dimensionLocation.dimensions.width;
    this._imageElement.location = zoom.location;
    return this.getStyles();
  }

  public pan(currentMousePosition: MousePosition): Style {
    const deltaMouse: MousePosition = this.calculateDeltaChange(currentMousePosition);
    this._lastMousePosition = currentMousePosition;
    const pan = new Pan();
    this._imageElement.location = pan.pan(deltaMouse, this._imageElement.location);
    return this.construsctStyle(
      'background-position',
      `${this._imageElement.location.left}px ${this._imageElement.location.top}px`
    );
  }

  public getStyles(): Style[] {
    const styles: Style[] = [];
    styles.push(this.construsctStyle(
      'background-size', 
      `${this._imageElement.scaledSize.width}px ${this._imageElement.scaledSize.height}px`
    ));
    styles.push(this.construsctStyle(
      'background-position',
      `${this._imageElement.location.left}px ${this._imageElement.location.top}px`
    ));
    return styles;
  }

  private construsctStyle(styleName: string, value: string): Style {
    const style: Style = {
      style: styleName,
      value: value,
     };
    return style;
  }

  private reSizeContainers(currentMousePosition: MousePostion): BoxDimensionsInterface {
    const resizedDimensions = this.calculateNewDimensions(currentMousePosition);
    this._lastMousePosition.x = currentMousePosition.x;
    this._lastMousePosition.y = currentMousePosition.y;
    resizedDimensions.width.value = 
      this.checkWidthFitsWithinContainer(
        resizedDimensions.width.value
      );
    const constrainedDimensions = this.checkDimensionsRelativeToContainer(resizedDimensions);
    this._imageElement.scaledSize.width = constrainedDimensions.width.value;
    this._imageElement.scaledSize.height = constrainedDimensions.height.value;
    this._imageElement.containerDimensions.height = constrainedDimensions.height.value;
    this._imageElement.containerDimensions.width = constrainedDimensions.width.value;
    return constrainedDimensions;
  }

  private resizeImage(): Style {
    const backgroundSize = 'background-size' as const;
    const height = this._imageElement.scaledSize.height;
    const width = this._imageElement.scaledSize.width;
    const style = {
      style: backgroundSize,
      value: `${width}px ${height}px`
    };
    return style;
  }

  private checkWidthFitsWithinContainer(width: number) {
    console.log('%c⧭', 'color: #e5de73', width);
    if (this._parent) {
      const newWidth = this._parent.checkDimensionRelativeToContainerElements(
        this._imageRef, 
        width
        );
        console.log('%c⧭', 'color: #7f2200', newWidth)
        return newWidth;
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

  private calculateDeltaChange(currentMousePosition: MousePostion): MousePosition {
    console.log('%c⧭', 'color: #33cc99', currentMousePosition);
    console.log('%c⧭', 'color: #364cd9', this._lastMousePosition);
    const newPosition: MousePosition = {
      x: currentMousePosition.x - this._lastMousePosition.x,
      y: currentMousePosition.y - this._lastMousePosition.y,
    }
    return newPosition;
  }

  private calculateNewDimensions(currentMousePosition: MousePostion): BoxDimensionsInterface {
    console.log('%c⧭', 'color: #2ceeaa', this._imageElement.scaledSize);
    const newPosition = this.calculateDeltaChange(currentMousePosition);
    console.log('%c⧭', 'color: #eeff00', newPosition);
    console.log('%c⧭', 'color: #73998c', this._imageElement.scaledSize);
    this._imageElement.scaledSize.width += newPosition.x;
    this._imageElement.scaledSize.height += newPosition.y;
    return {
      height: { value: this._imageElement.scaledSize.height, units: 'px' },
      width: {  value: this._imageElement.scaledSize.width, units: 'px' },
      top: { value: this._imageElement.location.top, units: 'px' },
      left: { value: this._imageElement.location.left, units: 'px' },
    };
  }
}
