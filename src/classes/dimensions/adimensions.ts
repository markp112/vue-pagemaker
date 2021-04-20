import { Dimensions } from '@/models/Dimensions/Dimensions';
import { Units } from '@/models/enums/units/units';

export class ADimension implements Dimensions {
  _height = 0;
  _width = 0;
  _units: Units = 'px';

  constructor();
  constructor(height: number, width: number);
  constructor(height: number, width: number, units: Units);
  constructor(height?: number, width?: number, units?: Units) {
    if (height) this._height = height;
    if (width) this._width = width;
    this._units = units ? units : 'px';
  }

  get height(): number {
    return this._height;
  }

  set height(height: number) {
    this._height = height;
  }
  
  get width(): number {
    return this._width;
  }

  set width(width: number) {
    this._width = width; 
  } 

  set units(units: Units) {
    this._units = units;
  }

  get units(): Units {
    return this._units;
  }

  toStyle(): string {
    const height = `height:${this._height}${this._units};`
    const width = `width:${this._width}${this._units};`;
    return `${height}${width}`;
  }

  toStringObject(): Dimensions {
    return {
      width: this._width,
      height: this._height,
      units: this._units,
    }
  }

}