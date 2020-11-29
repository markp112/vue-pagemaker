import {
  ComponentRef,
  ComponentTypesString,
  ActionEventInterface,
} from '@/models/components/base-component';
import {
  BoxDimensions, BoxDimensionsInterface,
} from '@/models/components/box-dimension';
import { Dimensions, Location } from '@/models/components/components';
import { Style } from '@/models/styles/styles';
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
  boxDimensions: BoxDimensions;
  actionEvent: ActionEventInterface;
  content: string;
}

export interface PageElementFirebaseData {
  name: string;
  ref: ComponentRef;
  componentHTMLTag: string;
  isContainer: boolean;
  styles: Style[];
  parentRef: string;
  classDefinition: string;
  type: ComponentTypesString;
  boxDimensions: BoxDimensionsInterface;
  actionEvent: ActionEventInterface;
  content: string;
}

export interface PageElementImage extends PageElementFirebaseData {
  naturalSize: Dimensions;
  location: Location;
  maintainRatio: boolean;
  scaledSize: Dimensions;
}