import { ButtonIconClassListInterface, ButtonIconClassInterface, IconType, ComponentNames } from '../button-icon/button-icon';
import { StyleTypes, StyleElement } from '@/classes/text-attributes/text-attributes';
import { SidebarButtonEventManager, ImpactedAttributeTypes } from '@/classes/sidebarButtonEventManager/sidebarButtonEventManager';

export class ButtonIconClassList implements ButtonIconClassListInterface {
  styledElement: ImpactedAttributeTypes;
  classType: StyleTypes;
  classNames: ButtonIconClassInterface[];
  iconImage: string;
  tooltip: string;
  iconIsTypeOf: IconType;
  componentName: ComponentNames;
  private eventManager = SidebarButtonEventManager.getInstance();

  constructor(bICLBuilder: ButtonIconClassListBuilder) {
    this.styledElement =bICLBuilder._styledElement;
    this.classType = bICLBuilder._classType;
    this.classNames = bICLBuilder._classNames;
    this.componentName = bICLBuilder._componentName;
    this.iconImage = bICLBuilder._iconImage;
    this.iconIsTypeOf = bICLBuilder._iconIsTypeOf;
    this.tooltip = bICLBuilder._tooltip;
  }

  update(iconElement: ButtonIconClassInterface) {
    const style: StyleElement = {
      styleName: this.classType,
      value: iconElement.classNameActive,
      units: 'px',
    };
    this.eventManager.applyValue(this.styledElement, style);
  }
}

export class ButtonIconClassListBuilder {
  _styledElement: ImpactedAttributeTypes = 'undefined';
  _classType: StyleTypes = 'undefined';
  _classNames: ButtonIconClassInterface[] = [];
  _iconImage = '';
  _tooltip = '';
  _iconIsTypeOf: IconType = 'class-list';
  _componentName: ComponentNames = 'icon-picker';

  withStyledElement(impactedAttribute: ImpactedAttributeTypes) {
    this._styledElement = impactedAttribute;
    return this;
  }

  withClassType(classType: StyleTypes) {
    this._classType = classType;
    return this;
  }

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
