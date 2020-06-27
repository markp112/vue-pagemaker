import { DimensionInterface } from '../components/box-dimension';

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
}

export class Border implements BorderInterface {
  private static instance: Border;
  borderDirection: BorderDirections = 'border';
  colour = '#000000';
  style: BorderStyle = 'solid';
  width: DimensionInterface = { value: 1, units: 'px' };
  borderRadius: DimensionInterface = { value: 1, units: 'px' };

  public static getInstance(): Border {
    if (!Border.instance) {
      Border.instance = new Border();
      Border.instance.borderDirection = 'border';
      Border.instance.colour = '#000000';
      Border.instance.style = 'solid';
      Border.instance.width = { value: 1, units: 'px' };
      Border.instance.borderRadius = { value: 1, units: 'px' };
    }
    return Border.instance;
  }
  // constructor(borderBuilder: BorderBuilder) {
  //   this.borderDirection = borderBuilder.borderDirection;
  //   this.borderRadius = borderBuilder.borderRadius;
  //   this.colour = borderBuilder.colour;
  //   this.style = borderBuilder.style;
  //   this.width = borderBuilder.width;
  // }

  getStyle(): Style {
    const style = `${this.style}`;
    const width = `${this.width.value}${this.width.units}`;
    const color = `${this.colour}`;
    const direction =
      this.borderDirection === 'border'
        ? this.borderDirection
        : `border-${this.borderDirection}`;
    const border: Style = {
      style: direction,
      value: `${width} ${style} ${color}`,
    };
    return border;
  }

  getBorderRadius = () => {
    const style: Style = {
      style: 'border-radius',
      value: `${this.borderRadius.value}${this.borderRadius.units}`,
    };
    return style;
  };
}

// export class BorderBuilder {
//   private _borderDirection: BorderDirections = null;
//   private _colour = 'rgba(0,0,0,1)';
//   private _style: BorderStyle = 'solid';
//   private _width: DimensionInterface = { value: 1, units: 'px' };
//   private _borderRadius: DimensionInterface = { value: 0, units: 'px' };

//   setBorderDirection(borderDirection: BorderDirections): BorderBuilder {
//     this._borderDirection = borderDirection;
//     return this;
//   }

//   setColour(colour: string): BorderBuilder {
//     this._colour = colour;
//     return this;
//   }

//   setStyle(style: BorderStyle): BorderBuilder {
//     this._style = style;
//     return this;
//   }

//   setWidth(width: DimensionInterface): BorderBuilder {
//     this._width = width;
//     return this;
//   }

//   setBorderRadius(borderRadius: DimensionInterface): BorderBuilder {
//     this._borderRadius = borderRadius;
//     return this;
//   }

//   public build(): Border {
//     return new Border(this);
//   }

//   get borderDirection(): BorderDirections {
//     return this._borderDirection;
//   }

//   get colour(): string {
//     return this._colour;
//   }

//   get borderRadius(): DimensionInterface {
//     return this._borderRadius;
//   }

//   get width(): DimensionInterface {
//     return this._width;
//   }

//   get style(): BorderStyle {
//     return this._style;
//   }
// }
