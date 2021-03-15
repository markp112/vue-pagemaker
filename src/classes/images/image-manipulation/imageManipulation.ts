import { ImageElement } from '@/classes/page-element/page-components/image-element/ImageElement';
import { MousePosition } from '@/components/page-builder-elements/generic/mixins/generic-components-mixin';
import { Style, StyleTags } from '@/models/styles/styles';
import { Pan } from './pan';
import { ResizeImage } from './resize';
import { Zoom } from './zoom';

export interface MousePostion {
  x: number;
  y: number;
}

export type ZoomDirection = 'in' | 'out' | '100' | '50' | 'zoomToFit';
export type StretchDirection = 'horizontal' | 'vertical';

export class ImageManipulator {
  private _lastMousePosition: MousePostion = {
    x: 0,
    y: 0
  };
  private _imageElement: ImageElement;

  constructor(imageElement: ImageElement) {
    this._imageElement = imageElement;
  }

  set lastMousePosition(mousePosition: MousePostion) {
    this._lastMousePosition = { ...mousePosition };
  }

  get imageElement(): ImageElement {
    console.log('%c⧭', 'color: #5200cc', this._imageElement);
    return this._imageElement;
  }

  public applyAction(action: ZoomDirection | StretchDirection): Style[] {
    if (action === 'vertical' || action === 'horizontal') {
      return this.stretch(action);
    } else {
      return this.zoom(action);
    }
  }

  public resize(currentMousePosition: MousePostion) {
    const deltaChange: MousePosition = this.getDeltaChange(currentMousePosition);
    this.lastMousePosition = { ...currentMousePosition };
    console.log('%c⧭', 'color: #9c66cc', this._imageElement);
    const resizeImage = new ResizeImage(this._imageElement);
    resizeImage.resize(deltaChange);
    this.applySizeStyles();
  }

  private applySizeStyles() {
    const styles: Style[] = [];
    const backgroundSize = `${this._imageElement.scaledSize.width}px ${this._imageElement.scaledSize.height}px`;
    console.log('%c⧭', 'color: #917399', backgroundSize);
    styles.push(
      this._imageElement.constructStyle('background-size', backgroundSize)
    );
    styles.push(
      this._imageElement.constructStyle(
        'height',
        `${this.imageElement.containerDimensions.height}px`
      )
    );
        console.log('%c⧭', 'color: #d90000', this.imageElement.containerDimensions.height);
    styles.push(
      this._imageElement.constructStyle(
        'width',
        `${this.imageElement.containerDimensions.width}px`
        )
        );
        console.log('%c⧭', 'color: #ffa640', this.imageElement.containerDimensions.width);
    styles.forEach(style => {
      this._imageElement.addStyle(style);
    });
  }

  public zoom(direction: ZoomDirection): Style[] {
    const zoom: Zoom = new Zoom(
      this._imageElement.scaledSize,
      this._imageElement.naturalSize,
      this._imageElement.location,
      this._imageElement.containerDimensions
      );
    const dimensionLocation = zoom.zoom(direction);
    this._imageElement.scaledSize.height = dimensionLocation.dimensions.height;
    this._imageElement.scaledSize.width = dimensionLocation.dimensions.width;
    this._imageElement.location = dimensionLocation.location;
    return this.getStyles();
  }

  public stretch(direction: 'horizontal' | 'vertical'): Style[] {
    if (direction === 'horizontal') {
      this._imageElement.location.left = 0;
      this._imageElement.scaledSize.width = this.imageElement.containerDimensions.width;
    } else {
      this._imageElement.location.top = 0;
      this._imageElement.scaledSize.height = this.imageElement.containerDimensions.height;
    }
    return this.getStyles();
  }

  public pan(currentMousePosition: MousePosition): Style {
    const deltaMouse: MousePosition = this.getDeltaChange(currentMousePosition);
    this._lastMousePosition = currentMousePosition;
    const pan = new Pan();
    this._imageElement.location = pan.pan(
      deltaMouse,
      this._imageElement.location
    );
    return this.construsctStyle(
      'background-position',
      `${this._imageElement.location.left}px ${this._imageElement.location.top}px`
    );
  }

  public getStyles(): Style[] {
    const styles: Style[] = [];
    styles.push(
      this.construsctStyle(
        'background-size',
        `${this._imageElement.scaledSize.width}px ${this._imageElement.scaledSize.height}px`
      )
    );
    styles.push(
      this.construsctStyle(
        'background-position',
        `${this._imageElement.location.left}px ${this._imageElement.location.top}px`
      )
    );
    return styles;
  }

  private construsctStyle(styleName: StyleTags, value: string): Style {
    const style: Style = {
      style: styleName,
      value: value
    };
    return style;
  }

  private getDeltaChange(currentMousePosition: MousePostion): MousePosition {
    const newPosition: MousePosition = {
      x: currentMousePosition.x - this._lastMousePosition.x,
      y: currentMousePosition.y - this._lastMousePosition.y
    };
    return newPosition;
  }
}
