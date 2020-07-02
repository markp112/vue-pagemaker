import { IconType, ComponentNames, ButtonIconClassInterface } from '../button-icon/button-icon';
import { ButtonRequestTypes } from '../button-factory/button-factory';


export class ButtonIconClassBuilder {
  _iconImage = '';
  _tooltip = '';
  _className = '';
  _iconIsTypeOf: IconType = 'class';
  _componentName: ComponentNames = 'icon-picker';
  
  build(): ButtonIconClassInterface {
    return {
      iconImage: this._iconImage,
      tooltip: this._tooltip,
      className: this._className,
      componentName: this._componentName,
      iconIsTypeOf: this._iconIsTypeOf,
    }
  }

  withClassName(className: string) {
    this._className = className;
    return this;
  }

  withIconImage(iconImage: string) {
    this._iconImage = iconImage;
    return this;
  }

  withToolTip(tooltip: string){
    this._tooltip = tooltip;
    return this;
  }

  withIconIsTypeOf(iconType: IconType) {
    this._iconIsTypeOf = iconType;
    return this;
  }

  withComponentName(componentName: ComponentNames) {
    this._componentName = componentName;
    return this;
  }
}



export class ButtonIconClassWrapper {

  build(whichButton: ButtonRequestTypes) {

    switch(whichButton) {
      case 'italic-button':
        return new ButtonIconClassBuilder()
        .withClassName('italic')
        .withIconImage('font_italic-32.png')
        .withToolTip('italic')
        .withComponentName('icon-toggle-button')
        .withIconIsTypeOf('class')
        .build();

      case 'underline-button':
        return new ButtonIconClassBuilder()
          .withClassName('underline')
          .withIconImage('font_underlined-32.png')
          .withToolTip('underline')
          .withComponentName('icon-toggle-button')
          .withIconIsTypeOf('class')
          .build();
      default:
        throw new Error(`Button Icon Class does not recognise button of type ${whichButton}`)
    }

  }
}
