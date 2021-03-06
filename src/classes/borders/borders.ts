import {
  BorderInterface,
  BorderDirections,
  BorderStyle,
  Style,
  StyleTags,
} from '@/models/styles/styles';
import { DimensionInterface } from '@/models/components/box-dimension';
import { StyleElement } from '../text-attributes/text-attributes';

export class Border implements BorderInterface {
  private static instance: Border;
  borderDirection: BorderDirections = 'border';
  colour = '#000000';
  _style: BorderStyle = 'solid';
  _width: DimensionInterface = { value: 1, units: 'px' };
  borderRadius: DimensionInterface = { value: 1, units: 'px' };
  shadow = '';

  public static getInstance(): Border {
    if (!Border.instance) {
      Border.instance = new Border();
    }
    return Border.instance;
  }

  applyStyle(styleElement: StyleElement): void {
    switch (styleElement.styleName) {
      case 'borderEdge':
        this.borderDirection = styleElement.value as BorderDirections;
        break;
      case 'borderStyle':
        this.style = styleElement.value as BorderStyle;
        break;
      case 'border-width':
        this.width = {
          value: parseInt(styleElement.value),
          units: styleElement.units,
        }
        break;
      case 'border-radius':
        this.borderRadius.units = styleElement.units;
        this.borderRadius.value = Number(styleElement.value);
        break;
      case 'shadow':
        this.shadow = styleElement.value;
        break;
    }
  }

  set width(amount: DimensionInterface) {
    if (this._width.value === 1 && amount.value === -1) {
      amount.value = -0.5;
    }
    this._width.value = this._width.value + amount.value < 0 
      ? 0 
      : this._width.value + amount.value;
    this._width.units = amount.units;
  }

  get width(): DimensionInterface {
    return this._width;
  }

  set style(style: BorderStyle) {
    this._style = style;
    if (this._style === 'double') {
      this._width.value = 3;
    }
  }

  get style(): BorderStyle {
    return this._style;
  }

  getStyle(): Style {
    const style = `${this.style}`;
    const width = `${this.width.value}${this.width.units}`;
    const color = `${this.colour}`;
    const direction =
      this.borderDirection === 'border'
        ? this.borderDirection
        : `border-${this.borderDirection}`;
    const border: Style = {
      style: direction as StyleTags,
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

  getShadow(): string {
    return this.shadow;
  }
}
