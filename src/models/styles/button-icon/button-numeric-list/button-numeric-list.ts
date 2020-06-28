import { ButtonIconStyleInterface, IconType, ComponentNames } from '../button-icon';
import { Style } from '../../styles';

export interface ButtonIconNumericInterface extends ButtonIconStyleInterface {
  valuesList: string[];
  defaultValue: string;
}

export class ButtonIconNumeric implements ButtonIconNumericInterface {
  valuesList: string[];
  defaultValue: string;
  style: Style;
  iconImage: string;
  tooltip: string;
  iconIsTypeOf: IconType;
  componentName: ComponentNames;

  constructor(bINBuilder: ButtonIconNumericBuilder) {
    this.valuesList = bINBuilder._valuesList;
    this.defaultValue = bINBuilder._defaultValue;
    this.iconImage = bINBuilder._iconImage;
    this.iconIsTypeOf = bINBuilder._iconIsTypeOf;
    this.style = bINBuilder._style;
    this.tooltip = bINBuilder._tooltip;
    this.componentName = bINBuilder._componentName;
  }
}

export class ButtonIconNumericBuilder {
  _valuesList: string[] = [];
  _defaultValue = '0';
  _style: Style = {
      style: 'font-size',
      value: '0'
  };
  _iconImage = '';
  _tooltip= '';
  _iconIsTypeOf: IconType = 'style';
  _componentName: ComponentNames = 'drop-down';

  withValuesList(valuesList: string[]) {
    this._valuesList = valuesList;
    return this;
  }

  withDefaultValue(defaultValue: string) {
    this._defaultValue = defaultValue;
    return this;
  }

  withStyle(styleName: string, value: string) {
    this._style = {
      style: styleName,
      value: value
    };
    return this;
  }

  withIconImage(iconImage: string) {
    this._iconImage = iconImage;
    return this;
  }

  withTooltip(tooltip: string) {
    this._tooltip = tooltip;
    return this;
  }

  withIconIsOfType(type: IconType) {
    this._iconIsTypeOf = type;
    return this;
  }

  withComponentName(componentName: ComponentNames) {
    this._componentName = componentName;
    return this;
  }

  build() {
    return new ButtonIconNumeric(this);
  }
}