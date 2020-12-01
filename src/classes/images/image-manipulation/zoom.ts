import { Dimensions, Location } from "@/models/components/components";
import { Units } from "@/models/enums/units/units";
import { ZoomDirection } from "./imageManipulation";

export class Zoom  {
  private _currentSize: Dimensions;
  private _naturalSize: Dimensions;
  private _location: Location;

  constructor(currentSize: Dimensions, naturalSize: Dimensions, location: Location) {
    this._currentSize = currentSize;
    this._naturalSize = naturalSize;
    this._location = location;
  }

    get location(): Location {
      return this._location;
    }

  private calcLocation(scaledDimensions: Dimensions) {
    const deltaX = (scaledDimensions.width - this._currentSize.width) / 2;
    const deltaY = (scaledDimensions.height - this._currentSize.height) / 2;

    this._location.left -= deltaX;
    this._location.top -= deltaY;

  }

  zoom(direction: ZoomDirection): { dimensions: Dimensions, location: Location } {
    const scale = 1.1 as const;  
    const scaledDimensions: Dimensions = {
      height: 0,
      width: 0,
      units: Units.px,
    };
    const newLocation: Location = {
      top: this._location.top,
      left: this._location.left,
    }
    switch (direction) {
      case 'out':
        scaledDimensions.height = this._currentSize.height / scale;
        scaledDimensions.width = this._currentSize.width / scale;
        newLocation.left =  0;
        newLocation.top =  0;
        break;
      case 'in':
        scaledDimensions.height = this._currentSize.height * scale;
        scaledDimensions.width = this._currentSize.width * scale;
        newLocation.left = 0;
        newLocation.top =  0;
        break;
      case '100':

        console.log('%c⧭', 'color: #00258c', this._naturalSize);
        scaledDimensions.height = this._naturalSize.height;
        scaledDimensions.width = this._naturalSize.width;
        break;
      case '50':
        scaledDimensions.height = this._naturalSize.height / 2;
        scaledDimensions.width = this._naturalSize.width / 2;
        break;
    }
    this.calcLocation(scaledDimensions);
    return { dimensions: scaledDimensions, location: newLocation };
  } 
}