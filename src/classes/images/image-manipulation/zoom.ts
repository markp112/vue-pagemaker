import { ALocation } from '@/classes/a-location/aLocation';
import { ADimension } from '@/classes/dimensions/adimensions';
import { ContainerProps, ImageProps } from '@/classes/page-element/page-components/image-element/ImageElement';
import { ZoomDirection } from './imageManipulation';

export class Zoom {
  private _imageProps: ImageProps;
  private _containerProps: ContainerProps;

  constructor(
    imageProps: ImageProps,
    containerProps: ContainerProps
  ) {
    this._imageProps = imageProps;
    this._containerProps = containerProps;
  }

  zoom(direction: ZoomDirection):
      { dimensions: ADimension; location: ALocation, containerDimensions: ADimension } {
    const SCALE = 1.1 as const;
    const scaledDimensions: ADimension = new ADimension(0, 0, 'px');
    switch (direction) {
      case 'out':
        scaledDimensions.height = this._imageProps.scaledSize.height / SCALE;
        scaledDimensions.width = this._imageProps.scaledSize.width / SCALE;
        this.calcLocation(scaledDimensions);
        break;
      case 'in':
        scaledDimensions.height = this._imageProps.scaledSize.height * SCALE;
        scaledDimensions.width = this._imageProps.scaledSize.width * SCALE;
        this.calcLocation(scaledDimensions);
        break;
      case '100':
        scaledDimensions.height = this._imageProps.naturalSize.height;
        scaledDimensions.width = this._imageProps.naturalSize.width;
        this._imageProps.location.left = -scaledDimensions.width / 2;
        this._imageProps.location.top = -scaledDimensions.height / 2;
        break;
      case '50':
        scaledDimensions.height = this._imageProps.naturalSize.height / 2;
        scaledDimensions.width = this._imageProps.naturalSize.width / 2;
        this._imageProps.location.left = -scaledDimensions.width / 2;
        this._imageProps.location.top = -scaledDimensions.height / 2;
        break;
      case '48':
        scaledDimensions.height = 48;
        scaledDimensions.width = 48;
        this._containerProps.dimensions.height = 48;
        this._containerProps.dimensions.width = 48;
        this._imageProps.location.left = 0;
        this._imageProps.location.top = 0;
        break;
      case '32':
        scaledDimensions.height = 32;
        scaledDimensions.width = 32;
        this._containerProps.dimensions.height = 32;
        this._containerProps.dimensions.width = 32;
        this._imageProps.location.left = 0;
        this._imageProps.location.top = 0;
        break;
      case '24':
        scaledDimensions.height = 24;
        scaledDimensions.width = 24;
        this._imageProps.location.left = 0;
        this._imageProps.location.top = 0;
        break;
      case '16':
        scaledDimensions.height = 16;
        scaledDimensions.width = 16;
        this._imageProps.location.left = 0;
        this._imageProps.location.top = 0;
        break;
      case 'zoomToFit':
        scaledDimensions.height = this._containerProps.dimensions.height;
        scaledDimensions.width = this._containerProps.dimensions.width;
        this._imageProps.location.left = 0;
        this._imageProps.location.top = 0;
        break;
    }
    return {
      dimensions: scaledDimensions,
      location: this._imageProps.location,
      containerDimensions: this._containerProps.dimensions
    };
  }

  private calcLocation(scaledDimensions: ADimension) {
    const deltaX = (scaledDimensions.width - this._imageProps.scaledSize.width) / 2;
    const deltaY = (scaledDimensions.height - this._imageProps.scaledSize.height) / 2;
    this._imageProps.location.left -= deltaX;
    this._imageProps.location.top -= deltaY;
  }
}
