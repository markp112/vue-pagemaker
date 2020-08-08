import {
  ButtonIconStyleInterface,
  IconType,
  ComponentNames,
} from '../button-icon';
import { Style } from '../../styles';
import { ButtonIconNumericBuilder } from '../../builders/button-icon-numeric';
import { BoxUnits } from '@/models/components/box-dimension';
import { ImpactedAttributeTypes } from '@/classes/sidebarButtonEventManager/sidebarButtonEventManager';

export interface ButtonIconNumericInterface extends ButtonIconStyleInterface {
  valuesList: string[];
  defaultValue: string;
  units: BoxUnits;
}

export class ButtonIconNumeric implements ButtonIconNumericInterface {
  styledElement: ImpactedAttributeTypes;
  valuesList: string[];
  defaultValue: string;
  style: Style;
  iconImage: string;
  tooltip: string;
  iconIsTypeOf: IconType;
  componentName: ComponentNames;
  units: BoxUnits;

  constructor(bINBuilder: ButtonIconNumericBuilder) {
    this.styledElement = bINBuilder._styledElement;
    this.valuesList = bINBuilder._valuesList;
    this.defaultValue = bINBuilder._defaultValue;
    this.iconImage = bINBuilder._iconImage;
    this.iconIsTypeOf = bINBuilder._iconIsTypeOf;
    this.style = bINBuilder._style;
    this.tooltip = bINBuilder._tooltip;
    this.componentName = bINBuilder._componentName;
    this.units = bINBuilder._units;
  }
}
