import { ButtonIconDimensionInterface, IconType, ComponentNames } from '../button-icon/button-icon';
import { Dimension, BoxUnits } from '@/models/components/box-dimension';
import { Border } from '@/classes/borders/borders';
import { Style } from '../styles';

export class ButtonIconDimension implements ButtonIconDimensionInterface {
  dimension: Dimension = new Dimension(0, 'px') ;
  style: Style = {
    style: '', 
    value: '',
  }
  iconImage = '';
  tooltip = '';
  iconIsTypeOf: IconType = 'dimension';
  componentName: ComponentNames = 'plus-minus';
  eventClass: Border;

  constructor(buttonIconDimensionBuilder: ButtonIconDimensionBuilder) {
    this.dimension = buttonIconDimensionBuilder._dimension;
    this.componentName = buttonIconDimensionBuilder._componentName;
    this.iconImage = buttonIconDimensionBuilder._iconImage;
    this.tooltip = buttonIconDimensionBuilder._tooltip;
    this.eventClass = buttonIconDimensionBuilder._eventClass;
    this.style = buttonIconDimensionBuilder._style;
  }
}

export class ButtonIconDimensionBuilder {
  _dimension: Dimension = new Dimension(0, 'px') ;
  _iconImage = '';
  _tooltip = '';
  _iconIsTypeOf: IconType = 'dimension';
  _componentName: ComponentNames = 'plus-minus';
  _eventClass: Border = Border.getInstance();
  _style: Style = {
    style: '', 
    value: '',
  };
  
  withStyle(style: string, value: string) {
    this._style.style = style;
    this._style.value = value;
    return this;
  }

  withDimension(value: number, units: BoxUnits) {
    this._dimension.value = value;
    this._dimension.units = units;
    return this;
  }

  withIconImage(image: string) {
    this._iconImage = image;
    return this;
  }

  withToolTip(toolTip: string) {
    this._tooltip = toolTip;
    return this;
  }

  withComponentName(componentName: ComponentNames) {
    this._componentName = componentName;
    return this;
  }

  build(): ButtonIconDimension {
    return new ButtonIconDimension(this);
  }
}