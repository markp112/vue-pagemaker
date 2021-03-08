import { Style } from "../styles";
import { Dimension } from "@/models/components/box-dimension";
import { StyleTypes } from "@/classes/text-attributes/text-attributes";
import { ImpactedAttributeTypes } from "@/classes/sidebarButtonEventManager/sidebarButtonEventManager";

export type IconType =
  | "class"
  | "style"
  | "style-list"
  | "class-list"
  | "dimension"
  | null;

export type ComponentNames =
  | "plus-minus"
  | "icon-picker"
  | "font-list"
  | "colour-select"
  | "text-list"
  | "icon-toggle-button"
  | "drop-down";

/**
 * @description baseline class for any button on the sidebar
 * @property iconImage - image to display on the toolbar for this button
 * @property toolTip - tooltip to display for the icon
 * @property iconIsTypeOf - determines which class this icon is based on IconType
 * @property componentName - name of the component which will display this icon
 */
export interface ButtonIconBaseInterface {
  styledElement: ImpactedAttributeTypes;
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
  style: Style;
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
  classNameActive: string;
  classNameInActive: string;
}

/**
 * @description extends base class where there is a need to select from several associated classes
 * as with a borderstyle
 * @property classNames - holds a list of the classes
 */
export interface ButtonIconClassListInterface extends ButtonIconBaseInterface {
  classType: StyleTypes;
  classNames: ButtonIconClassInterface[];
}
