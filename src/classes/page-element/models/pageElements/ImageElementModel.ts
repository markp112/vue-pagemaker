import { ADimension } from '@/classes/dimensions/adimensions';
import { ALocation } from '@/classes/a-location/aLocation';
import { PageElementFirebaseData, PageElementInterface } from "./PageElementModel";
import { Dimensions } from '@/models/Dimensions/Dimensions';
import { Location } from '@/models/location/location'

export interface ImageElementInterface extends PageElementInterface {
  ratio: number;
  maintainRatio: boolean;
  container: {
    location: ALocation,
    dimensions: ADimension,
  };
  image: {
    location: ALocation,
    naturalSize: ADimension,
    scaledSize: ADimension
  };
  toString(): string
}

export interface ImageElementFirebaseData extends PageElementFirebaseData {
  naturalSize: Dimensions /** @description natural size of the image */;
  scaledSize: Dimensions /** @description - this is the background image dimension */;
  ratio: number;
  maintainRatio: boolean;
  containerDimensions: Dimensions;
  containerLocation: Location;
  location: Location;
}
