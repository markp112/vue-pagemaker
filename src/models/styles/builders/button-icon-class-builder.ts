import { IconType, ComponentNames, ButtonIconClassInterface } from '../button-icon/button-icon';
import { ButtonRequestTypes } from '../button-factory/button-factory';


export class ButtonIconClassBuilder {
  _iconImage = '';
  _tooltip = '';
  _classNameActive = '';
  _classNameInActive = '';
  _iconIsTypeOf: IconType = 'class';
  _componentName: ComponentNames = 'icon-picker';
  
  build(): ButtonIconClassInterface {
    return {
      iconImage: this._iconImage,
      tooltip: this._tooltip,
      classNameActive: this._classNameActive,
      classNameInActive: this._classNameInActive,
      componentName: this._componentName,
      iconIsTypeOf: this._iconIsTypeOf,
    }
  }

  withClassNameActive(className: string) {
    this._classNameActive = className;
    return this;
  }

  withClassNameInActive(className: string) {
    this._classNameInActive = className;
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
        .withClassNameActive('italic')
        .withClassNameInActive('not-italic')
        .withIconImage('font_italic-32.png')
        .withToolTip('italic')
        .withComponentName('icon-toggle-button')
        .withIconIsTypeOf('class')
        .build();

      case 'underline-button':
        return new ButtonIconClassBuilder()
        .withClassNameActive('underline')
        .withClassNameInActive('no-underline')
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
