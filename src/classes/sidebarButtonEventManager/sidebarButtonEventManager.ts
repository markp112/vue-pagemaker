import {  TextAttributes, StyleElement } from '../text-attributes/text-attributes';

import { PageModule } from '@/store/page/page';
import { Style } from '@/models/styles/styles';

export type ImpactedAttributeTypes = 
  | 'border'
  | 'text'
  | 'colour'
  | 'undefined'

export class SidebarButtonEventManager {
  private static instance: SidebarButtonEventManager;
  impactedAtrribute: ImpactedAttributeTypes = 'undefined';

  public static getInstance(): SidebarButtonEventManager {
    if(!SidebarButtonEventManager.instance) {
      SidebarButtonEventManager.instance = new SidebarButtonEventManager();
    }
    return SidebarButtonEventManager.instance;
  }

  applyValue(impactedAtrribute: ImpactedAttributeTypes, styleElement: StyleElement) {
    const textAttribute: TextAttributes = TextAttributes.getInstance();
    this.impactedAtrribute = impactedAtrribute;
    switch (impactedAtrribute) {
      case 'text':
        textAttribute.applyStyle(styleElement);
        break;
      default:
        break;
    } 
  }

 updateEditedComponent() {
    switch (this.impactedAtrribute) {
      case 'text':
        this.applyTextStyle()
        break;
    
      default:
        break;
    }
  }

  private applyTextStyle() {
    const textAttribute: TextAttributes = TextAttributes.getInstance();
    const style: Style = {
      style: textAttribute.styleName,
      value: `${textAttribute.value}${textAttribute.units}`,
    }
    switch (textAttribute.classOrStyle) {
      case 'class':
        PageModule.updateComponentClassProperties(textAttribute.value);
        break;
      case 'style':
        PageModule.updateEditedComponentStyles(style);
    }
  }

}