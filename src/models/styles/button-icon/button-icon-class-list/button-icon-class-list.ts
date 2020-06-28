import { ButtonIconClassListInterface, ButtonIconClassInterface, IconType, ComponentNames } from '../button-icon';

export class ButtonIconClassList implements ButtonIconClassListInterface {
  classNames: ButtonIconClassInterface[];
  iconImage: string;
  tooltip: string;
  iconIsTypeOf: IconType;
  componentName: ComponentNames;

  constructor(bICLBuilder: ButtonIconClassListBuilder) {
    this.classNames = bICLBuilder._classNames;
    this.componentName = bICLBuilder._componentName;
    this.iconImage = bICLBuilder._iconImage;
    this.iconIsTypeOf = bICLBuilder._iconIsTypeOf;
    this.tooltip = bICLBuilder._tooltip;
  }
}

export class ButtonIconClassListBuilder {
  _classNames: ButtonIconClassInterface[] = [];
  _iconImage = '';
  _tooltip = '';
  _iconIsTypeOf: IconType = 'class-list';
  _componentName: ComponentNames = 'icon-picker';

  withClassNames(classNames: ButtonIconClassInterface[]) {
    this._classNames = classNames;
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

  build(): ButtonIconClassList {
    return new ButtonIconClassList(this);
  }

}