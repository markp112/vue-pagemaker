import { DimensionInterface } from '../components/box-dimension';
import { __makeTemplateObject } from 'tslib';

export interface Style {
  style: string;
  value: string;
}

export type BorderDirections = 'top' | 'bottom' | 'left' | 'right' | 'border' | null
export type BorderStyle = 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset' | 'hidden' | 'none';

export interface BorderInterface {
  borderDirection: BorderDirections;
  colour: string;
  style: BorderStyle;
  width: DimensionInterface;
  borderRadius: DimensionInterface;
  getBorderStyle(): Style;
  getBorderRadius(): Style;
}

//  

export class BorderBuilder {
  private readonly _border: BorderInterface;

  constructor() {
    this._border = {
      borderDirection: null,
      colour: 'rgba(0,0,0,1)',
      style: 'solid',
      width: { value: 1, units: 'px' },
      borderRadius: { value: 0, units: 'px' },
      getBorderStyle: () => {
        const style = `${this._border.style}`;
        const width = `${this._border.width.value}${this._border.width.units}`;
        const color = `${this._border.colour}`
        const direction = this._border.borderDirection === 'border' ? this._border.borderDirection : `border-${this._border.borderDirection}`;
        const border: Style = {style: direction, value: `${width} ${style} ${color}`};
        return border;
      },
      getBorderRadius: () => {
        const style: Style = { style: 'border-radius', value: `${this._border.borderRadius.value}${this._border.borderRadius.units}`};
        return style;
      }
    };
  }

  borderDirection(borderDirection: BorderDirections): BorderBuilder {
    this._border.borderDirection = borderDirection;
    return this;
  }

  colour(colour: string): BorderBuilder {
    this._border.colour = colour;
    return this;
  }

  style(style: BorderStyle): BorderBuilder {
    this._border.style = style;
    return this;
  }

  width(width: DimensionInterface): BorderBuilder {
    this._border.width = width;
    return this;
  }

  borderRadius(borderRadius: DimensionInterface): BorderBuilder {
    this._border.borderRadius = borderRadius;
    return this;
  }

  build(): BorderInterface {
    return this._border;
  }


}

///let x:BorderInterface = new BorderBuilder().build();
