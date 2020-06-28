import { Style } from '../styles';
import { Dimension } from '@/models/components/box-dimension';
import { ButtonIconDimension, ButtonIconDimensionBuilder } from './buttonIconDimension';
import { ButtonIconClassList, ButtonIconClassListBuilder } from './button-icon-class-list/button-icon-class-list';
import { shadowIconList, IconPickerInterface, borderEdgeIconList, lineStyleIconList, fontWeightIconList } from '@/models/components/icon-picker-models';



export type IconType = 
  | 'class'
  | 'style'
  | 'style-list'
  | 'class-list'
  | 'dimension'
  | null;

export type ComponentNames = 
  | 'plus-minus'
  | 'icon-picker'
  | 'font-list'
  | 'colour-select'
  | 'text-list'
  | 'icon-toggle-button'
  | 'drop-down'

/** 
 * @description baseline class for any button on the sidebar 
 * @property iconImage - image to display on the toolbar for this button
 * @property toolTip - tooltip to display for the icon
 * @property iconIsTypeOf - determines which class this icon is based on IconType
 * @property componentName - name of the component which will display this icon
*/
export interface ButtonIconBaseInterface {
  iconImage: string;
  tooltip: string;
  iconIsTypeOf: IconType;
  componentName: ComponentNames;
}

/**
 * @description extends the base for an icon which returns a an HTML Style tag
 * @property style - contains the html Style tag
 */
export interface ButtonIconStyleInterface extends ButtonIconBaseInterface {
  style: Style;
}

/**
 * @description extends base class for an icon which needs to capture a value and a unit
 * @property dimension holds the value and current units e.g. px, em, %
 */
export interface ButtonIconDimensionInterface extends ButtonIconBaseInterface {
  dimension: Dimension;
}

/**
 * @description extends base class for instances where one of several styles could be picked
 * @property styleName - base name for style
 * @property styleItems - the list of styles to be displayed in the drop down based
 * on the buttonIconStyleInteface 
 */
export interface ButtonIconStyleList extends ButtonIconBaseInterface {
  styleName: string;
  styleItems: ButtonIconStyleInterface[];
}

/**
 * @description extends the base class for an Icon that is return a CSS Class name
 * @property className - holds the css class name to be returned
 */
export interface ButtonIconClassInterface extends ButtonIconBaseInterface {
  className: string;
}

/**
 * @description extends base class where there is a need to select from several associated classes
 * as with a borderstyle
 * @property classNames - holds a list of the classes 
 */
export interface ButtonIconClassListInterface extends ButtonIconBaseInterface {
  classNames: ButtonIconClassInterface[];
}



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

export type ButtonListTypes = 
  | 'Shadow'
  | 'border-styles'
  | 'border-direction'
  | 'font-weight';

export class ButtonIconBuilder {

  build(whichButton: ButtonListTypes): ButtonIconClassList {
    switch (whichButton) {
      case 'Shadow' :
        return this.buildIconList(shadowIconList, 'shadows', 'shadows-32.png');
      case 'border-direction' :
        return this.buildIconList(borderEdgeIconList, 'border edge', 'project_stage_planning-32.png');
      case 'border-styles':
        return this.buildIconList(lineStyleIconList, 'border style', 'sketch-32.png');
      case 'font-weight':
        return this.buildIconList(fontWeightIconList, 'font weight', 'font_bold-32.png' )
      default:
        throw new Error("BButtonIconBuilder: unknown Button List Type");     
    }
    return this.buildIconList([], '', '');
  }

  private buildIconList(
      iconList: IconPickerInterface[],
      toolTip: string,
      iconImage: string
    ): ButtonIconClassList {
    const icons: ButtonIconClassInterface [] = [];
    iconList.forEach(icon => {
      const biCB: ButtonIconClassInterface = new ButtonIconClassBuilder()
        .withClassName(icon.class)
        .withIconImage(icon.icon)
        .withToolTip(icon.tooltip)
        .build();
        icons.push(biCB);
    })
    return new ButtonIconClassListBuilder()
      .withIconImage(iconImage)
      .withToolTip(toolTip)
      .withClassNames(icons)
      .build();
  }

}


export class IconButtonBuilder {

  // build(iconType: IconType): BorderButtonDimensionIcon {

  //   switch (iconType) {
  //     case 'dimension':
  //       return this.buildDimension();
  //       break;
  //     default: 
  //       throw new Error('unrecognised icon Type');
  //       break;
  //   }
  // }

  buildDimension(iconImage: string, toolTip: string): ButtonIconDimension {
    return new ButtonIconDimensionBuilder()
      .withComponentName('plus-minus')
      .withDimension(0, 'px')
      .withIconImage(iconImage)
      .withToolTip(toolTip)
      .build();
  }

  buildClassList(iconImage: string, classNames: ButtonIconClassInterface[], toolTip: string ): ButtonIconClassList {
    return new ButtonIconClassListBuilder()
      .withIconImage(iconImage)
      .withClassNames(classNames)
      .withToolTip(toolTip)
      .build();
  }

}