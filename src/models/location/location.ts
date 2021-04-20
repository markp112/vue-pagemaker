import { Units } from '../enums/units/units';

/**
 * @description used for storing the location of an object(images) in their wrapper element
 */
 export interface Location {
  top: number;
  left: number;
  units: Units;
}