import {
  ComponentRef,
  ComponentTypesString,
  ActionEventInterface,
} from '@/models/components/base-component';
import {
  BoxDimensions, BoxDimensionsInterface,
} from '@/models/components/box-dimension';
import { Style } from '@/models/styles/styles';
import { FirebasePageDataTypes } from '../../firebase-data/FirebaseDataBuilder';
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