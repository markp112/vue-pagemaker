import { ButtonIconStyleInterface, IconType, ComponentNames } from '../button-icon';
import { Style } from '../../styles';
import { ButtonIconNumericBuilder } from '../../builders/button-icon-numeric';
import { BoxUnits } from '@/models/components/box-dimension';

export interface ButtonIconNumericInterface extends ButtonIconStyleInterface {
  valuesList: string[];
  defaultValue: string;
  units: BoxUnits;
}

export class ButtonIconNumeric implements ButtonIconNumericInterface {
  valuesList: string[];
  defaultValue: string;
  style: Style;
  iconImage: string;
  tooltip: string;
  iconIsTypeOf: IconType;
  componentName: ComponentNames;
  units: BoxUnits;

  constructor(bINBuilder: ButtonIconNumericBuilder) {
    this.valuesList = bINBuilder._valuesList;
    this.defaultValue = bINBuilder._defaultValue;
    this.iconImage = bINBuilder._iconImage;
    this.iconIsTypeOf = bINBuilder._iconIsTypeOf;
    this.style = bINBuilder._style;
    this.tooltip = bINBuilder._tooltip;
    this.componentName = bINBuilder._componentName;
    this.units= bINBuilder._units;
  }
}
