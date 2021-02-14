import { Dimensions, Location } from "@/models/components/components";
import { PageElementFirebaseData, PageElementInterface } from "./PageElementModel";

export interface ImageElementInterface extends PageElementInterface {
  naturalSize: Dimensions;
  scaledSize: Dimensions;
  ratio: number;
  maintainRatio: boolean;
  // parentDimensions: Dimensions;
  location: Location;
}

export interface ImageElementFirebaseData extends PageElementFirebaseData {
  naturalSize: Dimensions /** @description natural size of the image */;
  scaledSize: Dimensions /** @description - this is the background image dimension */;
  ratio: number;
  maintainRatio: boolean;
  containerDimensions: Dimensions;
  location: Location;
}
