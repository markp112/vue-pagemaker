import { Units } from '@/models/enums/units/units';
import { Location } from '@/models/location/location';

export class ALocation implements Location {
  private _top: number;
  private _left: number;
  private _units: Units;

  constructor();
  constructor(top: number, left: number);
  constructor(top: number, left: number, units: Units);
  constructor(top?: number, left?: number, units?: Units) {
    this._top = top ? top : 0;
    this._left = left? left: 0;
    this._units = units? units : 'px';
  }

  get top(): number {
    return this._top;
  }

  set top(top: number) {
    this._top = top;
  }

  get left(): number {
    return this._left;
  }

  set left(left: number) {
    this._left = left;
  }

  get units(): Units {
    return this._units;
  }

  set units(units: Units) {
    this._units = units;
  }

  toStyle(): string {
    const left = `left:${this.left}${this._units};`;
    const top = `top:${this._top}${this._units};`;
    return `${left}${top}`
  }

  toStringObject(): Location {
    return {
      top: this._top,
      left: this._left,
      units: this._units
    };
  }
  
}