import { Style } from '../styles';
import { IconType, ComponentNames } from '../button-icon/button-icon';
import { ButtonIconNumeric } from '../button-icon/button-numeric-list/button-numeric-list';
import { ButtonRequestTypes } from '../button-factory/button-factory';

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

export class ButtonIconNumericBuilderWrapper {
  fontSizes = ['6', '8', '9', '10', '11', '12', '14', '16', '18', '20', '24', '26', '28', '36', '48', '72'];
  units = ['px','em','%'];

  build(whichButton: ButtonRequestTypes): ButtonIconNumeric {
    switch (whichButton) {
      case 'border-radius':
        return this.buildButton('bezier-32.png',this.units, 'px', whichButton, '0px');
      case 'font-size' :
        return this.buildButton('', this.fontSizes, '16', whichButton, '16');
      default:
        throw new Error('Unrecognised Numeric Button Type')
    }
  }

  private buildButton(iconImage: string, valuesList: string[], defaultvalue: string, styleName: string, styleValue: string) {
    return new ButtonIconNumericBuilder()
    .withIconImage(iconImage)
    .withValuesList(valuesList)
    .withDefaultValue(defaultvalue)
    .withStyle(styleName, styleValue)
    .build();
  }

}