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

export type ZoomDirection = 
| 'in'
| 'out'
| '100'
| '50'
| '48'
| '32'
| '24'
| '16'
| 'zoomToFit';

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
    const resizeImage = new ResizeImage(this._imageElement);
    resizeImage.resize(deltaChange);
    this.applySizeStyles();
  }

  private applySizeStyles() {
    const styles: Style[] = [];
    // const backgroundSize = `${this._imageElement.scaledSize.width}px ${this._imageElement.scaledSize.height}px`;
    // styles.push(
    //   this._imageElement.constructStyle('background-size', backgroundSize)
    // );
    // styles.push(
    //   this._imageElement.constructStyle(
    //     'height',
    //     `${this.imageElement.containerDimensions.height}px`
    //   )
    // );
    // styles.push(
    //   this._imageElement.constructStyle(
    //     'width',
    //     `${this.imageElement.containerDimensions.width}px`
    //     )
    //     );
    // styles.forEach(style => {
    //   this._imageElement.addStyle(style);
    // });
  }

  public zoom(direction: ZoomDirection): Style[] {
    const zoom: Zoom = new Zoom(
      this._imageElement.image,
      this._imageElement.container
      );
    const dimensionLocation = zoom.zoom(direction);
    this._imageElement.image.scaledSize = dimensionLocation.dimensions;
    this._imageElement.image.location = dimensionLocation.location ;
    // this._imageElement.containerDimensions = {...dimensionLocation.containerDimensions};
    this.applySizeStyles();
    return this.getStyles();
  }

  public stretch(direction: 'horizontal' | 'vertical'): Style[] {
    if (direction === 'horizontal') {
      this._imageElement.image.location.left = 0;
      this._imageElement.image.scaledSize.width = this.imageElement.containerDimensions.width;
    } else {
      this._imageElement.image.location.top = 0;
      this._imageElement.image.scaledSize.height = this.imageElement.containerDimensions.height;
    }
    return this.getStyles();
  }

  public pan(currentMousePosition: MousePosition) {
    const deltaMouse: MousePosition = this.getDeltaChange(currentMousePosition);
    this._lastMousePosition = currentMousePosition;
    const pan = new Pan();
    this._imageElement.image.location = pan.pan(
      deltaMouse,
      this._imageElement.image.location
    );
  }

  public getStyles(): Style[] {
    const styles: Style[] = [];
    // styles.push(
    //   this.constructStyle(
    //     'background-size',
    //     `${this._imageElement.scaledSize.width}px ${this._imageElement.scaledSize.height}px`
    //   )
    // );
    // styles.push(
    //   this.constructStyle(
    //     'background-position',
    //     `${this._imageElement.location.left}px ${this._imageElement.location.top}px`
    //   )
    // );
    // console.log('%c%s', 'color: #00736b', this._imageElement.containerDimensions.height === this.imageElement.scaledSize.height);
    // if (this._imageElement.containerDimensions.height === this.imageElement.scaledSize.height) {
    //   this.constructStyle('height', `${this.imageElement.scaledSize.height}px`);
    //   this.constructStyle('width', `${this.imageElement.scaledSize.width}px`);
    // }
    return styles;
  }

  private constructStyle(styleName: StyleTags, value: string): Style {
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
