import { Dimensions, Location } from '@/models/components/components';
import { Units } from '@/models/enums/units/units';
import { ZoomDirection } from './imageManipulation';

export class Zoom {
  private _currentSize: Dimensions;
  private _naturalSize: Dimensions;
  private _imageContainer: Dimensions;
  private _location: Location;

  constructor(
    currentSize: Dimensions,
    naturalSize: Dimensions,
    location: Location,
    imageContainer: Dimensions
  ) {
    this._currentSize = currentSize;
    this._naturalSize = naturalSize;
    this._location = location;
    this._imageContainer = imageContainer;
  }

  get location(): Location {
    return this._location;
  }

  zoom(
    direction: ZoomDirection
  ): { dimensions: Dimensions; location: Location, containerDimensions: Dimensions } {
    const scale = 1.1 as const;
    const scaledDimensions: Dimensions = {
      height: 0,
      width: 0,
      units: Units.px
    };
    switch (direction) {
      case 'out':
        scaledDimensions.height = this._currentSize.height / scale;
        scaledDimensions.width = this._currentSize.width / scale;
        this.calcLocation(scaledDimensions);
        break;
      case 'in':
        scaledDimensions.height = this._currentSize.height * scale;
        scaledDimensions.width = this._currentSize.width * scale;
        this.calcLocation(scaledDimensions);
        break;
      case '100':
        scaledDimensions.height = this._naturalSize.height;
        scaledDimensions.width = this._naturalSize.width;
        this._location.left = -scaledDimensions.width / 2;
        this._location.top = -scaledDimensions.height / 2;
        break;
      case '50':
        scaledDimensions.height = this._naturalSize.height / 2;
        scaledDimensions.width = this._naturalSize.width / 2;
        this._location.left = -scaledDimensions.width / 2;
        this._location.top = -scaledDimensions.height / 2;
        break;
      case '48':
        scaledDimensions.height = 48;
        scaledDimensions.width = 48;
        this._imageContainer.height = 48;
        this._imageContainer.width = 48;
        this._location.left = 0;
        this._location.top = 0;
        break;
      case '32':
        scaledDimensions.height = 32;
        scaledDimensions.width = 32;
        this._imageContainer.height = 32;
        this._imageContainer.width = 32;
        this._location.left = 0;
        this._location.top = 0;
        break;
      case '24':
        scaledDimensions.height = 24;
        scaledDimensions.width = 24;
        this._location.left = 0;
        this._location.top = 0;
        break;
      case '16':
        scaledDimensions.height = 16;
        scaledDimensions.width = 16;
        this._location.left = 0;
        this._location.top = 0;
        break;
      case 'zoomToFit':
        scaledDimensions.height = this._imageContainer.height;
        scaledDimensions.width = this._imageContainer.width;
        this._location.left = 0;
        this._location.top = 0;
        break;
    }
    return {
      dimensions: scaledDimensions,
      location: this._location,
      containerDimensions: this._imageContainer
    };
  }

  private calcLocation(scaledDimensions: Dimensions) {
    const deltaX = (scaledDimensions.width - this._currentSize.width) / 2;
    const deltaY = (scaledDimensions.height - this._currentSize.height) / 2;
    this._location.left -= deltaX;
    this._location.top -= deltaY;
  }
}
