export type BoxUnits = 'px' | '%' | 'em' | '';
export interface ResizeDimensions {
  height: number;
  width: number;
}
export interface DimensionInterface {
  value: number,
  units:  BoxUnits
}

export class Dimension implements DimensionInterface {
  value: number;
  units: BoxUnits;

  constructor (value: number, units: BoxUnits) {
    this.value = value;
    this.units = units;
  }
}

export interface BoxDimensionsInterface {
  width: Dimension;
  height: Dimension;
  top: Dimension; 
  left: Dimension;
};

export class BoxDimensions implements BoxDimensionsInterface {
  width: Dimension;
  height: Dimension;
  top: Dimension;
  left: Dimension;

  constructor(width: Dimension, height: Dimension, top: Dimension, left: Dimension){
    this.height = height;
    this.width = width;
    this.left = left;
    this.top = top;
  }

  get heightAsStyle(): string {
    return `height:${this.height.value}${this.height.units}`;
  }

  get widthAsStyle(): string {
    return `width:${this.width.value}${this.width.units}`;
  }

  get topAsStyle(): string {
    return `top:${this.top.value}${this.top.units}`;
  }

  get leftAsStyle(): string {
    return `width:${this.left.value}${this.left.units}`;
  }
  
  get getDimensionsAsStyleString(): string {
    return `${this.topAsStyle};${this.leftAsStyle};${this.widthAsStyle};${this.heightAsStyle}`;
  }

  get toObject(): BoxDimensionsInterface {
    return {
      height: { value: this.height.value, units: this.height.units },
      width: { value: this.width.value, units: this.width.units },
      left: { value: this.left.value, units: this.left.units },
      top: { value: this.top.value, units: this.top.units },
    }
  }
}


