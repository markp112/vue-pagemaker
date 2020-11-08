import { Dimensions, Location } from '@/models/components/components';
import { PageElementFirebaseData, PageElementInterface } from './pageElement';

export interface ImageElementInterface extends PageElementInterface {
  naturalSize: Dimensions;
  scaledSize: Dimensions;
  ratio: number;
  maintainRatio: boolean;
  parentDimensions: Dimensions;
  location: Location;
}

export interface ImageElementFirebaseData extends PageElementFirebaseData {
  naturalSize: Dimensions;
  scaledSize: Dimensions;
  ratio: number;
  maintainRatio: boolean;
  parentDimensions: Dimensions;
  location: Location;
}

