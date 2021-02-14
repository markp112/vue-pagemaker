import { PageElementClasses } from "../../factory/page-element-factory";
import { FirebasePageDataTypes } from "../../firebase-data/FirebaseDataBuilder";
import {
  PageElementFirebaseData,
  PageElementInterface
} from "../pageElements/PageElementModel";

export type StyleTypes = "border";
export type ContainerOrientation = "column" | "row";
export interface PageContainerInterface extends PageElementInterface {
  elements: PageElementClasses[];
  containerOrientation: ContainerOrientation;
  getWidthOfAllComponents(): number;
  getHeightOfAllComponents(): number;
}

export interface PageContainerFirebaseData extends PageElementFirebaseData {
  elements: FirebasePageDataTypes[];
}
