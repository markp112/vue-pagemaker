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
        scaledDimensions.width = this._currentSize.height * scale;
        newLocation.left = 0;
        newLocation.top =  0;
        break;
      case '100':
        scaledDimensions.height = this._naturalSize.height;
        scaledDimensions.width = this._naturalSize.width;
        break;
      case '50':
        scaledDimensions.height = this._naturalSize.height / 2;
        scaledDimensions.width = this._naturalSize.width / 2;
        break;
    }
    return { dimensions: scaledDimensions, location: newLocation };
  } 
}