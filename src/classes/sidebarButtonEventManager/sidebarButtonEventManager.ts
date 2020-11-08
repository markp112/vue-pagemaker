import {  TextAttributes, StyleElement } from '../text-attributes/text-attributes';

import { PageModule } from '@/store/page/page';
import { Style } from '@/models/styles/styles';
import { Border } from '../borders/borders';
import { Colour } from '../colour/singleton-colour';

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
    this.impactedAtrribute = impactedAtrribute;
    const colour = Colour.getInstance();
    const border: Border = Border.getInstance();
    const textAttribute: TextAttributes = TextAttributes.getInstance();
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
      case 'colour':
        colour.applyStyle(styleElement);
        break;
      default:
        break;
    } 
  }

 updateEditedComponent() {
    switch (this.impactedAtrribute) {
      case 'text':
        this.applyTextStyle();
        break;
      case 'border':
        this.applyBorderStyle();
        break;
      case 'shadow':
        this.applyShadowClass();
        break;
      case 'colour':
        this.applyColour();
        break;
      default:
        throw new Error("Unrecognised Event Manager type");
        
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
        break;
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

  private applyColour() {
    const colour: Colour = Colour.getInstance();
    if (colour.backgroundBorderForeground !=='border-color') {
      const style: Style = {
        style: colour.backgroundBorderForeground,
        value: colour.rgbColour,
      };
      PageModule.updateEditedComponentStyles(style);
    } else {
        const borderDefintion = Border.getInstance();
        borderDefintion.colour = colour.rgbColour;
        PageModule.updateEditedComponentStyles(borderDefintion.getStyle());
    }
  }
}