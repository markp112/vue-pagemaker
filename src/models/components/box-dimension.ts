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

export interface BoxProperties {
  width: number;
  height: number;
  top: number; 
  left: number;
  borderWidthLeft: number,
  borderWidthRight: number,
  padding: number,
};

export interface BoxDimensionsInterface {
  width: Dimension;
  height: Dimension;
  top: Dimension; 
  left: Dimension;
  borderWidthLeft: Dimension;
  borderWidthRight: Dimension;
  padding: Dimension;
};

export class BoxDimensions implements BoxDimensionsInterface {
  width: Dimension;
  height: Dimension;
  top: Dimension;
  left: Dimension;
  borderWidthLeft: Dimension;
  borderWidthRight: Dimension;
  padding: Dimension;
  

  constructor(
      width: Dimension,
      height: Dimension,
      top: Dimension,
      left: Dimension,
      borderWidthLeft: Dimension,
      borderWidthRight: Dimension,
      padding: Dimension){
    this.height = height;
    this.width = width;
    this.left = left;
    this.top = top;
    this.borderWidthLeft = borderWidthLeft;
    this.borderWidthRight = borderWidthRight;
    this.padding = padding;
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
      borderWidthLeft: { value: this.borderWidthLeft.value, units: this.borderWidthLeft.units },
      borderWidthRight: { value: this.borderWidthRight.value, units: this.borderWidthRight.units },
      padding: { value: this.padding.value, units: this.padding.units },
    }
  }
}


