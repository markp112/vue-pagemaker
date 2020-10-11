import { ComponentTypes } from '../components/components';
import {
  ComponentRef,
  ComponentTypesString,
  ActionEvent,
} from '@/models/components/base-component';
import {
  BoxDimensions,
} from '../components/box-dimension';
import { Style } from '@/models/styles/styles';
import { PageElement } from '../../classes/page-element/PageElement';
import { ComponentContainer } from "../../classes/page-element/ComponentContainer";
//interface for an html Style

// represents the definition of the object the user has dropped on the page
export interface PageElementInterface {
  name: string;
  ref: ComponentRef;
  componentHTMLTag: string;
  isContainer: boolean;
  styles: Style[];
  parentRef: string;
  classDefinition: string;
  type: ComponentTypesString;
  data: ComponentTypes;
  boxDimensions: BoxDimensions;
  action: ActionEvent;

  setDefaultStyling(): void;
}

export type StyleTypes = 'border';
export interface PageContainerInterface extends PageElementInterface {
  elements: PageElement[];
}

export type PageData = PageElement | ComponentContainer;

