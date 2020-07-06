import {  TextAttributes, StyleElement } from '../text-attributes/text-attributes';

import { PageModule } from '@/store/page/page';
import { Style } from '@/models/styles/styles';
import { Border } from '../borders/borders';

export type ImpactedAttributeTypes = 
  | 'border'
  | 'text'
  | 'colour'
  | 'shadow'
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
    const border: Border = Border.getInstance();
    this.impactedAtrribute = impactedAtrribute;
    switch (impactedAtrribute) {
      case 'text':
        textAttribute.applyStyle(styleElement);
        break;
      case 'border':
        border.applyStyle(styleElement);
        break;
      case 'shadow': 
        border.applyStyle(styleElement);
        break;
      default:
        break;
    } 
  }

 updateEditedComponent() {
   console.log('%c%s', 'color: #d0bfff', this.impactedAtrribute);
    switch (this.impactedAtrribute) {
      case 'text':
        this.applyTextStyle();
        break;
      case 'border':
        console.log("Camme Here")
        this.applyBorderStyle();
        break;
      case 'shadow':
        this.applyShadowClass();
        break;
      default:
        break;
    }
  }
  /** @description retrieve the values set on the textAttributes and apply them
   * to the edited component
   */
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

  private applyBorderStyle() {
    const border: Border = Border.getInstance();
    PageModule.updateEditedComponentStyles(border.getStyle());
    PageModule.updateEditedComponentStyles(border.getBorderRadius());
  }

  private applyShadowClass() {
    const border: Border = Border.getInstance();
    PageModule.updateComponentClassProperties(border.getShadow());
  }
}