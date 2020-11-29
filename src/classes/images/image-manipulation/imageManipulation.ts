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

  private _imageBoundRect!: BoxProperties;
  private _containerBoundingRect!: BoxProperties;
  private _imageRef = '';
  private _parent!: PageContainer;
  private _currentDimensions!: Dimensions;
  private _naturalSize!: Dimensions;
  private _location!: Location;

  get imageRef(): string {
    return this._imageRef;
  }

  set imageRef(imageRef: string) {
    this._imageRef = imageRef
  }

  get imageHeight(): number {
    return this._currentDimensions.height;
  }

  set imageHeight(height: number) {
    this._currentDimensions.height = height;
  }

  get imageWidth(): number {
    return this._currentDimensions.width;
  }

  set imageWidth(width: number) {
    this._currentDimensions.width = width;
  }

  set currentSize(currentSize: Dimensions) {
    this._currentDimensions = currentSize;
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
    this._lastMousePosition = mousePosition; 
  }
  
  get parent(): PageContainer {
    return this._parent;
  }

  set parentContainer(container: PageContainer) {
    this._parent = container;
  }

  get naturalSize(): Dimensions {
    return this._naturalSize;
  }

  set naturalSize(naturalSize: Dimensions) {
    this._naturalSize = naturalSize;
  }

  set location(location: Location) {
    this._location = location;
  }

  public resize(currentMousePosition: MousePostion): { boxDimensions: BoxDimensionsInterface, style: Style} {
    return {
      boxDimensions: this.reSizeContainers(currentMousePosition),
      style: this.resizeImage(),
    };
  }

  public zoom(direction: ZoomDirection): Style[] {
    const zoom: Zoom = new Zoom(this._currentDimensions, this._naturalSize, this._location);
    const dimensionLocation = zoom.zoom(direction);
    this._currentDimensions = dimensionLocation.dimensions;
    this._location = dimensionLocation.location;
    return this.getStyles();
  }

  public pan(currentMousePosition: MousePosition): Style {
    const deltaMouse: MousePosition = this.calculateDeltaChange(currentMousePosition);
    this._lastMousePosition = currentMousePosition;
    const pan = new Pan();
    const newLocation = pan.pan(deltaMouse, this._location);
    this._location = newLocation;
    return this.construsctStyle('background-position', `${this._location.left}px ${this._location.top}px`);
  }

  public getStyles(): Style[] {
    const styles: Style[] = [];
    styles.push(this.construsctStyle('background-size',`${this._currentDimensions.width}px ${this._currentDimensions.height}px`));
    styles.push(this.construsctStyle('background-position',`${this._location.left}px ${this._location.top}px`));
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
    this._lastMousePosition = currentMousePosition;
    resizedDimensions.width.value = 
      this.checkWidthFitsWithinContainer(
        resizedDimensions.width.value
      );
    const constrainedDimensions = this.checkDimensionsRelativeToContainer(resizedDimensions);
    this._currentDimensions.width = constrainedDimensions.width.value;
    this._currentDimensions.height = constrainedDimensions.height.value;
    return constrainedDimensions;
  }

  private resizeImage(): Style {
    const backgroundSize = 'background-size' as const;
    let style = {
      style: backgroundSize,
      value: `${this._currentDimensions.width}px ${this._currentDimensions.height}px`
    };
    if (this._naturalSize) {
      if (this._currentDimensions.width > this._naturalSize.width) {
        style = {
          style: backgroundSize,
          value: `${this._currentDimensions.width}px ${this._naturalSize.height}px`
        };
      } else if (this._currentDimensions.width < this._naturalSize.width) {
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

  private calculateDeltaChange(currentMousePosition: MousePostion): MousePosition {
    const newPosition: MousePosition = {
      x: currentMousePosition.x - this._lastMousePosition.x,
      y: currentMousePosition.y - this._lastMousePosition.y,
    }
    return newPosition;
  }

  private calculateNewDimensions(currentMousePosition: MousePostion): BoxDimensionsInterface {
    const newPosition = this.calculateDeltaChange(currentMousePosition);
    return {
      height: { value: this._imageBoundRect.height + newPosition.y, units: 'px' },
      width: { value: this._imageBoundRect.width + newPosition.x, units: 'px' },
      top: { value: this._imageBoundRect.top, units: 'px' },
      left: { value: this._imageBoundRect.left, units: 'px' },
    };
  }
}
